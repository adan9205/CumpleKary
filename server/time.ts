import { DateTime, IANAZone } from "luxon";
import type { EditionConfig } from "../config/types.js";
import type { CountdownStage } from "../shared/types.js";

export function resolveViewerZone(
  raw: unknown,
  fallback: string,
): string {
  if (typeof raw !== "string") {
    return fallback;
  }
  const zone = raw.trim();
  if (!zone || zone === "unknown" || zone.length > 80) {
    return fallback;
  }
  if (!IANAZone.isValidZone(zone)) {
    return fallback;
  }
  return zone;
}

export function targetUtc(
  config: EditionConfig,
  zone: string = config.timeZone,
): DateTime {
  const [hours, minutes, seconds] = config.targetTime.split(":").map(Number);
  const date = DateTime.fromISO(config.targetDate, { zone });
  if (!date.isValid) {
    throw new Error(`Invalid targetDate for ${config.year}`);
  }
  return date
    .set({
      hour: hours ?? 0,
      minute: minutes ?? 0,
      second: seconds ?? 0,
      millisecond: 0,
    })
    .toUTC();
}

export function parseDebugNow(raw: unknown): DateTime | null {
  if (typeof raw !== "string" || !raw) {
    return null;
  }
  const parsed = DateTime.fromISO(raw, { setZone: true });
  if (!parsed.isValid) {
    return null;
  }
  return parsed.toUTC();
}

export function stageFor(
  config: EditionConfig,
  nowUtc: DateTime,
  zone: string = config.timeZone,
): CountdownStage {
  const target = targetUtc(config, zone);
  const days = Math.max(
    0,
    Math.ceil(target.diff(nowUtc, "days").days),
  );
  const ordered = [...config.stages].sort(
    (a, b) => a.maxDaysInclusive - b.maxDaysInclusive,
  );
  for (const stage of ordered) {
    if (days <= stage.maxDaysInclusive) {
      return stage;
    }
  }
  return ordered[ordered.length - 1] ?? config.stages[0];
}

export function isUnlocked(
  config: EditionConfig,
  nowUtc: DateTime,
  zone: string = config.timeZone,
): boolean {
  return nowUtc >= targetUtc(config, zone);
}
