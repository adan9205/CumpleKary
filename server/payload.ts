import type { EditionConfig } from "../config/types.js";
import type { PublicEdition, SurprisePayload } from "../shared/types.js";
import { targetUtc } from "./time.js";

export function publicEdition(
  config: EditionConfig,
  zone: string = config.timeZone,
): PublicEdition {
  return {
    year: config.year,
    title: config.title,
    targetUtc: targetUtc(config, zone).toISO() ?? "",
    timeZone: zone,
    timeZoneOfficial: config.timeZone,
    stages: config.stages,
  };
}

/** Accepts a bare id or any watch / youtu.be / shorts / embed URL. */
export function youtubeId(raw: string): string {
  const value = raw.trim();
  if (/^[\w-]{11}$/.test(value)) {
    return value;
  }
  const match = value.match(
    /(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/,
  );
  return match?.[1] ?? "";
}

export function surprisePayload(config: EditionConfig): SurprisePayload {
  return {
    photoSrc: config.photoSrc,
    photoAlt: config.photoAlt,
    paragraphs: [...config.paragraphs],
    gift1: { ...config.gift1 },
    gift2: { ...config.gift2 },
    youtubeId: youtubeId(config.youtubeId),
    songSrc: config.songSrc,
    finale: config.finale,
    cats: [...config.cats],
  };
}
