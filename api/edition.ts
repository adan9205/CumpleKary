import { DateTime } from "luxon";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEdition } from "../config/index.js";
import { methodNotAllowed, parseYear, send } from "../server/http.js";
import { publicEdition, surprisePayload } from "../server/payload.js";
import { debugAuthorized, readEditionSession } from "../server/session.js";
import { isUnlocked, parseDebugNow } from "../server/time.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    methodNotAllowed(res, "GET");
    return;
  }

  const year = parseYear(req.query.year);
  const config = year ? getEdition(year) : null;
  if (!year || !config) {
    send(res, 404, { ok: false, error: "unknown_year" });
    return;
  }

  if (!readEditionSession(req, year)) {
    send(res, 401, { ok: false, error: "unauthorized" });
    return;
  }

  const debugRaw = req.query.debug;
  const debugKey = req.query.key;
  let now: DateTime = DateTime.utc();
  let simulated = false;

  if (typeof debugRaw === "string" && debugRaw) {
    if (!debugAuthorized(req, debugKey)) {
      send(res, 403, { ok: false, error: "debug_forbidden" });
      return;
    }
    const parsed = parseDebugNow(debugRaw);
    if (!parsed) {
      send(res, 400, { ok: false, error: "bad_debug_date" });
      return;
    }
    now = parsed;
    simulated = true;
  }

  const edition = publicEdition(config);
  if (!isUnlocked(config, now)) {
    send(res, 200, {
      ok: true,
      phase: "countdown",
      edition,
      simulated,
    });
    return;
  }

  send(res, 200, {
    ok: true,
    phase: "surprise",
    edition,
    surprise: surprisePayload(config),
    simulated,
  });
}
