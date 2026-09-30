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
      gradient: "linear-gradient(165deg, #0f241c 0%, #071410 45%, #0a1c16 100%)",
    },
    {
      id: "mid",
      maxDaysInclusive: 29,
      catSrc: "/assets/cats/02-sideeye.svg",
      gradient: "linear-gradient(165deg, #16382e 0%, #071410 42%, #3d2a18 100%)",
    },
    {
      id: "near",
      maxDaysInclusive: 13,
      catSrc: "/assets/cats/03-neutral.svg",
      gradient: "linear-gradient(165deg, #1a3d32 0%, #0c221c 40%, #4a3218 100%)",
    },
    {
      id: "close",
      maxDaysInclusive: 6,
      catSrc: "/assets/cats/04-smile.svg",
      gradient: "linear-gradient(165deg, #245044 0%, #0f241c 38%, #b87333 100%)",
    },
    {
      id: "almost",
      maxDaysInclusive: 1,
      catSrc: "/assets/cats/05-happy.svg",
      gradient: "linear-gradient(165deg, #145c56 0%, #0c221c 40%, #c4894a 100%)",
    },
  ],
};
