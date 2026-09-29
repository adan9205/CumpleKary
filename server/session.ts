import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ADMIN_COOKIE,
  ADMIN_MAX_AGE,
  EDITION_MAX_AGE,
  editionCookieName,
  RATE_COOKIE,
  RATE_MAX_AGE,
  readCookie,
  setCookie,
} from "./cookies.js";

type EditionClaims = {
  typ: "ed";
  y: number;
  exp: number;
  vl: 0 | 1;
};

type AdminClaims = {
  typ: "ad";
  exp: number;
};

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error("SESSION_SECRET missing or too short");
  }
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(claims: EditionClaims | AdminClaims): string {
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString(
    "base64url",
  );
  return `${payload}.${sign(payload)}`;
}

function decode<T extends EditionClaims | AdminClaims>(
  token: string,
): T | null {
  const dot = token.indexOf(".");
  if (dot === -1) {
    return null;
  }
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims = JSON.parse(json) as T;
    if (typeof claims.exp !== "number" || claims.exp < Date.now()) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function readEditionSession(
  req: VercelRequest,
  year: number,
): EditionClaims | null {
  const raw = readCookie(req, editionCookieName(year));
  if (!raw) {
    return null;
  }
  const claims = decode<EditionClaims>(raw);
  if (!claims || claims.typ !== "ed" || claims.y !== year) {
    return null;
  }
  return claims;
}

export function readAdminSession(req: VercelRequest): AdminClaims | null {
  const raw = readCookie(req, ADMIN_COOKIE);
  if (!raw) {
    return null;
  }
  const claims = decode<AdminClaims>(raw);
  if (!claims || claims.typ !== "ad") {
    return null;
  }
  return claims;
}

export function issueEditionSession(
  req: VercelRequest,
  res: VercelResponse,
  year: number,
  visitLogged: boolean,
) {
  const token = encode({
    typ: "ed",
    y: year,
    vl: visitLogged ? 1 : 0,
    exp: Date.now() + EDITION_MAX_AGE * 1000,
  });
  setCookie(res, req, editionCookieName(year), token, EDITION_MAX_AGE);
}

export function issueAdminSession(req: VercelRequest, res: VercelResponse) {
  const token = encode({
    typ: "ad",
    exp: Date.now() + ADMIN_MAX_AGE * 1000,
  });
  setCookie(res, req, ADMIN_COOKIE, token, ADMIN_MAX_AGE);
}

export function ensureRateId(req: VercelRequest, res: VercelResponse): string {
  const existing = readCookie(req, RATE_COOKIE);
  if (existing && existing.length >= 8 && existing.length <= 80) {
    return existing;
  }
  const id = randomBytes(16).toString("hex");
  setCookie(res, req, RATE_COOKIE, id, RATE_MAX_AGE);
  return id;
}

export function accessPasswordFor(year: number): string | null {
  const key = `ACCESS_PASSWORD_${year}`;
  const value = process.env[key];
  return value && value.length > 0 ? value : null;
}

export function debugAuthorized(
  req: VercelRequest,
  debugKey: unknown,
): boolean {
  if (readAdminSession(req)) {
    return true;
  }
  const expected = process.env.DEBUG_SECRET;
  if (!expected || typeof debugKey !== "string" || !debugKey) {
    return false;
  }
  return safeEqual(debugKey, expected);
}
