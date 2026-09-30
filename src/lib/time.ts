import type { CountdownStage, PublicEdition } from "../../shared/types";

export type Remain = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export function remaining(targetUtc: string, now = Date.now()): Remain {
  const totalMs = Math.max(0, new Date(targetUtc).getTime() - now);
  const seconds = Math.floor(totalMs / 1000);
  return {
    totalMs,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export function stageNow(edition: PublicEdition, remain: Remain): CountdownStage {
  const ordered = [...edition.stages].sort(
    (a, b) => a.maxDaysInclusive - b.maxDaysInclusive,
  );
  for (const stage of ordered) {
    if (remain.days <= stage.maxDaysInclusive) {
      return stage;
    }
  }
  return ordered[ordered.length - 1] ?? edition.stages[0];
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Horizon matches the "mid" stage (29 days). 0 far away, 1 at target. */
export function tentacleIntensity(remain: Remain, horizonDays = 29): number {
  if (remain.totalMs <= 0) {
    return 1;
  }
  const daysLeft = remain.totalMs / 86400000;
  return Math.min(1, Math.max(0, 1 - daysLeft / horizonDays));
}
