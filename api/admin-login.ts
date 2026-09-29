import type { VercelRequest, VercelResponse } from "@vercel/node";
import { methodNotAllowed, readJson, send } from "../server/http.ts";
import {
  ensureRateId,
  issueAdminSession,
  safeEqual,
} from "../server/session.ts";
import {
  hasTurso,
  isLocked,
  memoryFail,
  memoryLocked,
  registerFailure,
  requireTurso,
} from "../server/db.ts";

const ADMIN_YEAR = 0;

type Body = { password?: unknown };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    methodNotAllowed(res, "POST");
    return;
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    send(res, 500, { ok: false, error: "admin_not_configured" });
    return;
  }

  const body = readJson<Body>(req);
  const password = typeof body.password === "string" ? body.password : "";
  const rateId = ensureRateId(req, res);
  const useTurso = hasTurso();
  if (!useTurso && requireTurso()) {
    send(res, 503, { ok: false, error: "db_unavailable" });
    return;
  }

  const locked = useTurso
    ? await isLocked(ADMIN_YEAR, rateId)
    : memoryLocked(ADMIN_YEAR, rateId);
  if (locked) {
    send(res, 429, { ok: false, error: "too_many_attempts" });
    return;
  }

  if (!password || !safeEqual(password, expected)) {
    if (useTurso) {
      await registerFailure(ADMIN_YEAR, rateId);
    } else {
      memoryFail(ADMIN_YEAR, rateId);
    }
    send(res, 401, { ok: false, error: "invalid_password" });
    return;
  }

  issueAdminSession(req, res);
  send(res, 200, { ok: true });
}
