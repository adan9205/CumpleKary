import type { CountdownStage } from "../shared/types.ts";

export type EditionConfig = {
  year: number;
  title: string;
  targetDate: string;
  targetTime: string;
  timeZone: string;
  photoSrc: string;
  photoAlt: string;
  paragraphs: [string, string, string, string, string];
  gift1: { imageSrc: string; caption: string };
  gift2: { imageSrc: string; caption: string };
  youtubeId: string;
  songSrc: string;
  finale: string;
  cats: string[];
  stages: CountdownStage[];
};
