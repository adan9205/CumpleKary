import type { EditionConfig } from "./types.js";

export const edition2026: EditionConfig = {
  year: 2026,
  title: "2026",
  targetDate: "2026-10-05",
  targetTime: "00:00:00",
  timeZone: "America/Los_Angeles",
  photoSrc: "/assets/editions/2026/photo.jpg",
  photoAlt: "Foto",
  paragraphs: [
    "Hay muchas cosas que he ido descubriendo de ti con el tiempo. Algunas me las has contado directamente y otras simplemente las he ido viendo en nuestras conversaciones. Y creo que una de las cosas que más me gusta es que todavía siento que hay partes de ti que no conozco, cosas que probablemente ni tú misma has terminado de descubrir.",
    "Muchas veces eres bastante dura contigo misma y quizá no siempre alcanzas a ver todo lo que eres capaz de hacer. Por eso me gustó tanto verte terminar este reto. No porque necesitara que lo ganaras, sino porque quería que tú misma pudieras comprobar algo que yo ya veía: que puedes adaptarte y superar cosas que parecen difíciles.",
    "También he visto que aunque algunas cosas te cansen, te frustren o te hagan pensar demasiado, sigues encontrando algo por lo que avanzar. A veces será un reto, otras veces algo completamente diferente, pero siempre terminas buscando qué hacer después. Y creo que esa parte de ti, aunque quizá no siempre la notes, vale mucho.",
    "Y obviamente no podía hacer esto sin mencionar a la Kary que me ha dado suficientes momentos para reírme 😂. Desde Illaoi, los retos, los “me lleva la free”, las canas verdes y todas esas ocurrencias que aparecen de la nada. Porque entre todas las cosas serias, también están esos momentos sencillos que hacen que hablar contigo sea divertido.",
    "Quiero que sepas que muchos de los cambios que ves en mí no nacieron de la noche a la mañana. Hubo un catalizador que hizo que empezara a preocuparme más por mí mismo, a seguir echándole ganas y a querer avanzar de verdad. Ese catalizador fuiste tú. Y creo que, sin planearlo, terminamos impulsándonos mutuamente a seguir mejorando.",
    "Aunque hayamos tenido momentos en los que hemos estado distanciados, malos entendidos o situaciones que nos han llevado a pensar erróneamente del otro, creo que muchas cosas se pueden arreglar mientras ambos queramos hablarlas y entendernos. Para mí, eso también es parte de valorar un vínculo: no esperar que nunca haya problemas, sino saber que podemos hablarlos cuando aparezcan.",
    "Para este cumpleaños no quiero decirte que tienes que convertirte en alguien diferente. Solo quiero que sigas descubriendo todo lo que eres capaz de hacer. Que cuando llegue algo difícil recuerdes que ya has superado cosas que alguna vez parecían complicadas. Y que, aunque cambies de camino, de objetivo o de reto, nunca dejes de intentar descubrir hasta dónde puedes llegar."
  ],
  gift1: {
    imageSrc: "/assets/editions/2026/ticket.png",
    caption:
      "Un vale sin caducidad, el cual podrá ser canjeado en cualquier momento.",
  },
  gift2: {
    imageSrc: "/assets/editions/2026/soon.png",
    caption:
      "Esta sorpresa aún se encuentra en proceso y en cuanto esté se actualizará.",
  },
  youtubeId: "9Kr8QT2EMT0",
  songSrc: "/assets/editions/2026/song.mp3",
  finale: "Feliz cumpleaños 🎂!!!!",
  cats: [
    "/assets/cats/01-grumpy.jpg",
    "/assets/cats/02-sideeye.jpg",
    "/assets/cats/03-neutral.jpg",
    "/assets/cats/04-smile.jpg",
    "/assets/cats/05-happy.jpg",
    "/assets/cats/06-party.jpg",
  ],
  stages: [
    {
      id: "far",
      maxDaysInclusive: 9999,
      catSrc: "/assets/cats/01-grumpy.jpg",
      gradient: "linear-gradient(165deg, #0f241c 0%, #071410 45%, #0a1c16 100%)",
    },
    {
      id: "mid",
      maxDaysInclusive: 29,
      catSrc: "/assets/cats/02-sideeye.jpg",
      gradient: "linear-gradient(165deg, #16382e 0%, #071410 42%, #3d2a18 100%)",
    },
    {
      id: "near",
      maxDaysInclusive: 13,
      catSrc: "/assets/cats/03-neutral.jpg",
      gradient: "linear-gradient(165deg, #1a3d32 0%, #0c221c 40%, #4a3218 100%)",
    },
    {
      id: "close",
      maxDaysInclusive: 6,
      catSrc: "/assets/cats/04-smile.jpg",
      gradient: "linear-gradient(165deg, #245044 0%, #0f241c 38%, #b87333 100%)",
    },
    {
      id: "almost",
      maxDaysInclusive: 1,
      catSrc: "/assets/cats/05-happy.jpg",
      gradient: "linear-gradient(165deg, #145c56 0%, #0c221c 40%, #c4894a 100%)",
    },
  ],
};
