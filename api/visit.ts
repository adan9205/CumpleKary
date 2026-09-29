import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEdition } from "../config/index.ts";
import {
  clientTimeZone,
  methodNotAllowed,
  parseYear,
  readJson,
  send,
} from "../server/http.ts";
import {
  geoFromHeaders,
  hasTurso,
  recordVisit,
  requireTurso,
} from "../server/db.ts";
import {
  issueEditionSession,
  readEditionSession,
} from "../server/session.ts";

type Body = { year?: unknown; timeZone?: unknown };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    methodNotAllowed(res, "POST");
    return;
  }

  const body = readJson<Body>(req);
  const year = parseYear(body.year);
  if (!year || !getEdition(year)) {
    send(res, 404, { ok: false, error: "unknown_year" });
    return;
  }

  const session = readEditionSession(req, year);
  if (!session) {
    send(res, 401, { ok: false, error: "unauthorized" });
    return;
  }

  if (session.vl === 1) {
    send(res, 200, { ok: true, duplicate: true });
    return;
  }

  if (!hasTurso()) {
    if (requireTurso()) {
      send(res, 503, { ok: false, error: "db_unavailable" });
      return;
    }
    issueEditionSession(req, res, year, true);
    send(res, 200, { ok: true, skipped: true });
    return;
  }

  const geo = geoFromHeaders(req.headers);
  await recordVisit({
    year,
    timeZone: clientTimeZone(req, body.timeZone),
    country: geo.country,
    region: geo.region,
    city: geo.city,
    userAgent: String(req.headers["user-agent"] ?? ""),
  });
  issueEditionSession(req, res, year, true);
  send(res, 200, { ok: true });
}
