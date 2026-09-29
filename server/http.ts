import type { VercelRequest, VercelResponse } from "@vercel/node";

export function readJson<T>(req: VercelRequest): T {
  const body = req.body;
  if (body && typeof body === "object") {
    return body as T;
  }
  return {} as T;
}

export function send(
  res: VercelResponse,
  status: number,
  payload: unknown,
) {
  res.status(status).setHeader("Cache-Control", "no-store");
  res.json(payload);
}

export function methodNotAllowed(res: VercelResponse, allow: string) {
  res.setHeader("Allow", allow);
  send(res, 405, { ok: false, error: "method_not_allowed" });
}

export function parseYear(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(n) || n < 2000 || n > 2100) {
    return null;
  }
  return n;
}

export function clientTimeZone(req: VercelRequest, bodyTz?: unknown): string {
  if (typeof bodyTz === "string" && bodyTz.length > 0 && bodyTz.length < 80) {
    return bodyTz;
  }
  const header = req.headers["x-vercel-ip-timezone"];
  if (typeof header === "string" && header) {
    return header;
  }
  return "unknown";
}
