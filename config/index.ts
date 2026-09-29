import { edition2026 } from "./2026.ts";
import type { EditionConfig } from "./types.ts";

const editions: Record<number, EditionConfig> = {
  [edition2026.year]: edition2026,
};

export function getEdition(year: number): EditionConfig | null {
  return editions[year] ?? null;
}

export function listEditionYears(): number[] {
  return Object.keys(editions)
    .map(Number)
    .sort((a, b) => b - a);
}

export function getCurrentYear(): number {
  const raw = process.env.CURRENT_YEAR;
  const parsed = raw ? Number(raw) : 2026;
  if (!Number.isInteger(parsed) || !editions[parsed]) {
    return edition2026.year;
  }
  return parsed;
}
