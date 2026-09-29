import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEdition } from "../config/index.js";
import { methodNotAllowed, parseYear, send } from "../server/http.js";
import { readAdminSession, readEditionSession } from "../server/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    methodNotAllowed(res, "GET");
    return;
  }

  if (req.query.admin === "1") {
    const admin = readAdminSession(req);
    send(res, 200, {
      ok: true,
      authenticated: Boolean(admin),
      admin: Boolean(admin),
    });
    return;
  }

  const year = parseYear(req.query.year);
  if (!year || !getEdition(year)) {
    send(res, 404, { ok: false, error: "unknown_year" });
    return;
  }

  const session = readEditionSession(req, year);
  if (!session) {
    send(res, 200, { ok: true, authenticated: false });
    return;
  }

  send(res, 200, {
    ok: true,
    authenticated: true,
    year,
    visitLogged: session.vl === 1,
  });
}
