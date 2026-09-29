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
