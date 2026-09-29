import type { VercelRequest, VercelResponse } from "@vercel/node";

function isSecureRequest(req: VercelRequest): boolean {
  if (process.env.VERCEL) {
    return true;
  }
  const proto = req.headers["x-forwarded-proto"];
  return proto === "https";
}

export function cookieOptions(
  req: VercelRequest,
  maxAgeSec: number,
): string {
  const parts = [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (isSecureRequest(req)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function readCookie(req: VercelRequest, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) {
    return null;
  }
  const parts = header.split(";");
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) {
      continue;
    }
    const key = part.slice(0, idx).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}

export function setCookie(
  res: VercelResponse,
  req: VercelRequest,
  name: string,
  value: string,
  maxAgeSec: number,
) {
  const prev = res.getHeader("Set-Cookie");
  const next = `${name}=${encodeURIComponent(value)}; ${cookieOptions(req, maxAgeSec)}`;
  if (!prev) {
    res.setHeader("Set-Cookie", next);
    return;
  }
  const list = Array.isArray(prev) ? prev.map(String) : [String(prev)];
  res.setHeader("Set-Cookie", [...list, next]);
}

export function editionCookieName(year: number): string {
  return `pk_ed_${year}`;
}

export const ADMIN_COOKIE = "pk_admin";
export const RATE_COOKIE = "pk_rl";

export const EDITION_MAX_AGE = 90 * 24 * 60 * 60;
export const ADMIN_MAX_AGE = 24 * 60 * 60;
export const RATE_MAX_AGE = 24 * 60 * 60;
