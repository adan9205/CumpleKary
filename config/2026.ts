import type { EditionConfig } from "./types.ts";

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
      gradient: "linear-gradient(165deg, #2a1b22 0%, #1a1216 45%, #3d2a1f 100%)",
    },
    {
      id: "mid",
      maxDaysInclusive: 29,
      catSrc: "/assets/cats/02-sideeye.svg",
      gradient: "linear-gradient(165deg, #2b1d28 0%, #1a1218 45%, #4a2c28 100%)",
    },
    {
      id: "near",
      maxDaysInclusive: 13,
      catSrc: "/assets/cats/03-neutral.svg",
      gradient: "linear-gradient(165deg, #2a1f2e 0%, #16121c 45%, #3d2a40 100%)",
    },
    {
      id: "close",
      maxDaysInclusive: 6,
      catSrc: "/assets/cats/04-smile.svg",
      gradient: "linear-gradient(165deg, #2a1824 0%, #1a1016 45%, #5a2a38 100%)",
    },
    {
      id: "almost",
      maxDaysInclusive: 1,
      catSrc: "/assets/cats/05-happy.svg",
      gradient: "linear-gradient(165deg, #2c1a22 0%, #1c1014 40%, #7a3a2a 100%)",
    },
  ],
};
