import type { EditionConfig } from "./types.js";

export const edition2026: EditionConfig = {
  year: 2026,
  title: "2026",
  targetDate: "2026-10-05",
  targetTime: "00:00:00",
  timeZone: "America/Los_Angeles",
  photoSrc: "/assets/editions/2026/photo.svg",
  photoAlt: "Foto (reemplaza photo.svg o photo.webp)",
  paragraphs: [
    "Placeholder 1. Sustituye este párrafo en config/2026.ts por el primero.",
    "Placeholder 2. Un recuerdo, una promesa o lo que quieras decirle.",
    "Placeholder 3. Sigue el tono que tú elijas; la app solo muestra el texto.",
    "Placeholder 4. Cinco slides, uno tras otro, con un gatito discreto.",
    "Placeholder 5. El último párrafo antes de los regalos.",
  ],
  gift1: {
    imageSrc: "/assets/editions/2026/ticket.svg",
    caption:
      "Un vale sin caducidad, el cual podrá ser canjeado en cualquier momento.",
  },
  gift2: {
    imageSrc: "/assets/editions/2026/soon.svg",
    caption:
      "Esta sorpresa aún se encuentra en proceso y en cuanto esté se actualizará.",
  },
  youtubeId: "",
  songSrc: "/assets/editions/2026/song.mp3",
  finale: "Feliz cumpleaños 🎂!!!!",
  cats: [
    "/assets/cats/01-grumpy.svg",
    "/assets/cats/02-sideeye.svg",
    "/assets/cats/03-neutral.svg",
    "/assets/cats/04-smile.svg",
    "/assets/cats/05-happy.svg",
    "/assets/cats/06-party.svg",
  ],
  stages: [
    {
      id: "far",
      maxDaysInclusive: 9999,
      catSrc: "/assets/cats/01-grumpy.svg",
      gradient: "linear-gradient(165deg, #241026 0%, #1a0d17 45%, #3a1a2a 100%)",
    },
    {
      id: "mid",
      maxDaysInclusive: 29,
      catSrc: "/assets/cats/02-sideeye.svg",
      gradient: "linear-gradient(165deg, #2c1230 0%, #1a0d17 45%, #4a1c30 100%)",
    },
    {
      id: "near",
      maxDaysInclusive: 13,
      catSrc: "/assets/cats/03-neutral.svg",
      gradient: "linear-gradient(165deg, #33143a 0%, #1c0e1a 45%, #5c1f3a 100%)",
    },
    {
      id: "close",
      maxDaysInclusive: 6,
      catSrc: "/assets/cats/04-smile.svg",
      gradient: "linear-gradient(165deg, #3a1638 0%, #1e0f1c 40%, #6b1e3f 100%)",
    },
    {
      id: "almost",
      maxDaysInclusive: 1,
      catSrc: "/assets/cats/05-happy.svg",
      gradient: "linear-gradient(165deg, #4a1a3e 0%, #200f1c 40%, #742f20 100%)",
    },
  ],
};
