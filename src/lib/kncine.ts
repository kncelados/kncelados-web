export interface KncineEntry {
  title: string;
  src: string;
  alt: string;
}

export const kncine = [
  {
    title: "Interstellar",
    src: "/posters/interstellar.jpg",
    alt: "Poster de Interstellar",
  },
  {
    title: "La venganza de los Sith",
    src: "/posters/revenge-of-the-sith.jpg",
    alt: "Poster de La venganza de los Sith",
  },
  {
    title: "Crazy Stupid Love",
    src: "/posters/crazy-stupid-love.jpg",
    alt: "Poster de Crazy Stupid Love",
  },
  {
    title: "Forrest Gump",
    src: "/posters/forrest-gump.jpg",
    alt: "Poster de Forrest Gump",
  },
  {
    title: "El club de la lucha",
    src: "/posters/fight-club.jpg",
    alt: "Poster de El club de la lucha",
  },
  {
    title: "Kiss Kiss Bang Bang",
    src: "/posters/kiss-kiss-bang-bang.jpg",
    alt: "Poster de Kiss Kiss Bang Bang",
  },
  {
    title: "Gladiator",
    src: "/posters/gladiator.jpg",
    alt: "Poster de Gladiator",
  },
  {
    title: "Shrek",
    src: "/posters/shrek.jpg",
    alt: "Poster de Shrek",
  },
] satisfies KncineEntry[];