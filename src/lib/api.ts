import type { EditionResponse } from "../../shared/types";

async function parse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    const err = new Error(data.error ?? `http_${res.status}`);
    throw err;
  }
  return data;
}

export function viewerTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown";
  } catch {
    return "unknown";
  }
}

export async function fetchMeta() {
  return parse<{ ok: true; currentYear: number; years: number[] }>(
    await fetch("/api/meta"),
  );
}

export async function fetchSession(year: number) {
  return parse<{
    ok: true;
    authenticated: boolean;
    year?: number;
    visitLogged?: boolean;
  }>(await fetch(`/api/session?year=${year}`));
}

export async function fetchAdminSession() {
  return parse<{ ok: true; authenticated: boolean; admin?: boolean }>(
    await fetch("/api/session?admin=1"),
  );
}

export async function unlock(year: number, password: string) {
  return parse<{ ok: true; year: number }>(
    await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year,
        password,
        timeZone: viewerTimeZone(),
      }),
    }),
  );
}

export async function fetchEdition(
  year: number,
  debug?: string | null,
  key?: string | null,
) {
  const params = new URLSearchParams({ year: String(year) });
  if (debug) {
    params.set("debug", debug);
  }
  if (key) {
    params.set("key", key);
  }
  return parse<EditionResponse>(await fetch(`/api/edition?${params}`));
}

export async function logVisit(year: number) {
  return parse<{ ok: true }>(
    await fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, timeZone: viewerTimeZone() }),
    }),
  );
}

export async function adminLogin(password: string) {
  return parse<{ ok: true }>(
    await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }),
  );
}

export async function fetchAdminVisits(year: number) {
  return parse<{
    ok: true;
    year: number;
    years: number[];
    total: number;
    visits: Array<{
      id: number;
      year: number;
      visitedAt: string;
      timeZone: string;
      country: string;
      region: string;
      city: string;
      userAgent: string;
    }>;
  }>(await fetch(`/api/admin-visits?year=${year}`));
}
