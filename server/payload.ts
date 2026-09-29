import type { EditionConfig } from "../config/types.ts";
import type { PublicEdition, SurprisePayload } from "../shared/types.ts";
import { targetUtc } from "./time.ts";

export function publicEdition(config: EditionConfig): PublicEdition {
  return {
    year: config.year,
    title: config.title,
    targetUtc: targetUtc(config).toISO() ?? "",
    timeZoneOfficial: config.timeZone,
    stages: config.stages,
  };
}

export function surprisePayload(config: EditionConfig): SurprisePayload {
  return {
    photoSrc: config.photoSrc,
    photoAlt: config.photoAlt,
    paragraphs: [...config.paragraphs],
    gift1: { ...config.gift1 },
    gift2: { ...config.gift2 },
    youtubeId: config.youtubeId,
    songSrc: config.songSrc,
    finale: config.finale,
    cats: [...config.cats],
  };
}
