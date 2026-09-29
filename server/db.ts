import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let ready: Promise<void> | null = null;

export function hasTurso(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

export function requireTurso(): boolean {
  return Boolean(process.env.VERCEL && process.env.VERCEL_ENV === "production");
}

function getClient(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error("Turso env missing");
    }
    client = createClient({ url, authToken });
  }
  return client;
}

async function migrate(db: Client) {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        visited_at TEXT NOT NULL,
        time_zone TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT '',
        region TEXT NOT NULL DEFAULT '',
        city TEXT NOT NULL DEFAULT '',
        user_agent TEXT NOT NULL DEFAULT ''
      )`,
      `CREATE INDEX IF NOT EXISTS idx_visits_year ON visits(year)`,
      `CREATE TABLE IF NOT EXISTS unlock_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        rate_id TEXT NOT NULL,
        failed_at TEXT NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_unlock_year_rate ON unlock_attempts(year, rate_id, failed_at)`,
    ],
    "write",
  );
}

export async function db(): Promise<Client> {
  const c = getClient();
  if (!ready) {
    ready = migrate(c);
  }
  await ready;
  return c;
}

function headerValue(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string {
  const raw = headers[name];
  if (Array.isArray(raw)) {
    return raw[0] ?? "";
  }
  return raw ?? "";
}

export function geoFromHeaders(
  headers: Record<string, string | string[] | undefined>,
): { country: string; region: string; city: string } {
  return {
    country: headerValue(headers, "x-vercel-ip-country"),
    region: headerValue(headers, "x-vercel-ip-country-region"),
    city: decodeURIComponent(
      headerValue(headers, "x-vercel-ip-city").replace(/\+/g, " "),
    ),
  };
}

export async function recordVisit(input: {
  year: number;
  timeZone: string;
  country: string;
  region: string;
  city: string;
  userAgent: string;
}) {
  const c = await db();
  await c.execute({
    sql: `INSERT INTO visits (year, visited_at, time_zone, country, region, city, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.year,
      new Date().toISOString(),
      input.timeZone,
      input.country,
      input.region,
      input.city,
      input.userAgent.slice(0, 400),
    ],
  });
}

export async function listVisits(year: number) {
  const c = await db();
  const result = await c.execute({
    sql: `SELECT id, year, visited_at, time_zone, country, region, city, user_agent
          FROM visits WHERE year = ? ORDER BY visited_at DESC LIMIT 500`,
    args: [year],
  });
  return result.rows.map((row) => ({
    id: Number(row.id),
    year: Number(row.year),
    visitedAt: String(row.visited_at),
    timeZone: String(row.time_zone),
    country: String(row.country),
    region: String(row.region),
    city: String(row.city),
    userAgent: String(row.user_agent),
  }));
}

export async function countVisits(year: number): Promise<number> {
  const c = await db();
  const result = await c.execute({
    sql: `SELECT COUNT(*) AS n FROM visits WHERE year = ?`,
    args: [year],
  });
  return Number(result.rows[0]?.n ?? 0);
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;

export async function registerFailure(year: number, rateId: string) {
  const c = await db();
  await c.execute({
    sql: `INSERT INTO unlock_attempts (year, rate_id, failed_at) VALUES (?, ?, ?)`,
    args: [year, rateId, new Date().toISOString()],
  });
}

export async function isLocked(year: number, rateId: string): Promise<boolean> {
  const c = await db();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const result = await c.execute({
    sql: `SELECT COUNT(*) AS n FROM unlock_attempts
          WHERE year = ? AND rate_id = ? AND failed_at >= ?`,
    args: [year, rateId, since],
  });
  return Number(result.rows[0]?.n ?? 0) >= MAX_FAILS;
}

const memoryFails = new Map<string, number[]>();

export function memoryLocked(year: number, rateId: string): boolean {
  const key = `${year}:${rateId}`;
  const now = Date.now();
  const kept = (memoryFails.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  memoryFails.set(key, kept);
  return kept.length >= MAX_FAILS;
}

export function memoryFail(year: number, rateId: string) {
  const key = `${year}:${rateId}`;
  const now = Date.now();
  const kept = (memoryFails.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  kept.push(now);
  memoryFails.set(key, kept);
}
