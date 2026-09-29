import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEdition } from "../config/index.js";
import {
  clientTimeZone,
  methodNotAllowed,
  parseYear,
  readJson,
  send,
} from "../server/http.js";
import {
  hasTurso,
  isLocked,
  memoryFail,
  memoryLocked,
  recordVisit,
  registerFailure,
  requireTurso,
  geoFromHeaders,
} from "../server/db.js";
import {
  accessPasswordFor,
  ensureRateId,
  issueEditionSession,
  safeEqual,
} from "../server/session.js";

type Body = {
  year?: unknown;
  password?: unknown;
  timeZone?: unknown;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    methodNotAllowed(res, "POST");
    return;
  }

  try {
    const body = readJson<Body>(req);
    const year = parseYear(body.year);
    const password = typeof body.password === "string" ? body.password : "";
    if (!year || !getEdition(year)) {
      send(res, 404, { ok: false, error: "unknown_year" });
      return;
    }

    const expected = accessPasswordFor(year);
    if (!expected) {
      send(res, 500, { ok: false, error: "password_not_configured" });
      return;
    }

    const rateId = ensureRateId(req, res);
    const useTurso = hasTurso();
    if (!useTurso && requireTurso()) {
      send(res, 503, { ok: false, error: "db_unavailable" });
      return;
    }

    const locked = useTurso
      ? await isLocked(year, rateId)
      : memoryLocked(year, rateId);
    if (locked) {
      send(res, 429, { ok: false, error: "too_many_attempts" });
      return;
    }

    if (!password || !safeEqual(password, expected)) {
      if (useTurso) {
        await registerFailure(year, rateId);
      } else {
        memoryFail(year, rateId);
      }
      send(res, 401, { ok: false, error: "invalid_password" });
      return;
    }

    issueEditionSession(req, res, year, true);

    if (useTurso) {
      const geo = geoFromHeaders(req.headers);
      await recordVisit({
        year,
        timeZone: clientTimeZone(req, body.timeZone),
        country: geo.country,
        region: geo.region,
        city: geo.city,
        userAgent: String(req.headers["user-agent"] ?? ""),
      });
    }

    send(res, 200, { ok: true, year });
  } catch (error) {
    console.error(error);
    send(res, 500, { ok: false, error: "unlock_failed" });
  }
}
