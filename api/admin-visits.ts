import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEdition, listEditionYears } from "../config/index.ts";
import { methodNotAllowed, parseYear, send } from "../server/http.ts";
import { countVisits, hasTurso, listVisits, requireTurso } from "../server/db.ts";
import { readAdminSession } from "../server/session.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    methodNotAllowed(res, "GET");
    return;
  }

  if (!readAdminSession(req)) {
    send(res, 401, { ok: false, error: "unauthorized" });
    return;
  }

  const years = listEditionYears();
  const year = parseYear(req.query.year) ?? years[0] ?? 2026;
  if (!getEdition(year)) {
    send(res, 404, { ok: false, error: "unknown_year" });
    return;
  }

  if (!hasTurso()) {
    if (requireTurso()) {
      send(res, 503, { ok: false, error: "db_unavailable" });
      return;
    }
    send(res, 200, { ok: true, year, years, total: 0, visits: [] });
    return;
  }

  const [visits, total] = await Promise.all([
    listVisits(year),
    countVisits(year),
  ]);
  send(res, 200, { ok: true, year, years, total, visits });
}
