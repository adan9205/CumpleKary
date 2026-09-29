export type CountdownStageId =
  | "far"
  | "mid"
  | "near"
  | "close"
  | "almost";

export type CountdownStage = {
  id: CountdownStageId;
  maxDaysInclusive: number;
  catSrc: string;
  gradient: string;
};

export type PublicEdition = {
  year: number;
  title: string;
  targetUtc: string;
  timeZoneOfficial: string;
  stages: CountdownStage[];
};

export type SurprisePayload = {
  photoSrc: string;
  photoAlt: string;
  paragraphs: string[];
  gift1: { imageSrc: string; caption: string };
  gift2: { imageSrc: string; caption: string };
  youtubeId: string;
  songSrc: string;
  finale: string;
  cats: string[];
};

export type EditionResponse =
  | {
      ok: true;
      phase: "countdown";
      edition: PublicEdition;
      simulated: boolean;
      /** Server "now" (UTC ISO). Differs from wall clock when simulated. */
      nowUtc: string;
    }
  | {
      ok: true;
      phase: "surprise";
      edition: PublicEdition;
      surprise: SurprisePayload;
      simulated: boolean;
    };

export type SessionResponse =
  | { ok: true; authenticated: false }
  | { ok: true; authenticated: true; year: number; visitLogged: boolean }
  | { ok: true; authenticated: true; admin: true };

export type VisitRow = {
  id: number;
  year: number;
  visitedAt: string;
  timeZone: string;
  country: string;
  region: string;
  city: string;
  userAgent: string;
};
