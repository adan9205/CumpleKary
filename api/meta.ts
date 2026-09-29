import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCurrentYear, listEditionYears } from "../config/index.ts";
import { methodNotAllowed, send } from "../server/http.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    methodNotAllowed(res, "GET");
    return;
  }
  send(res, 200, {
    ok: true,
    currentYear: getCurrentYear(),
    years: listEditionYears(),
  });
}
