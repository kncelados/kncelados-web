export interface CollaborationFormat {
  label: string;
  desc: string;
}

/** Formatos ofrecidos. Lista real del MediaKit 2026, sin precios (el PDF con
 *  precios no es público). No se inventa ningún formato ni resultado. */
export const formats: CollaborationFormat[] = [
  {
    label: "Vídeo corto",
    desc: "Vídeo corto específico protagonizado por el equipo de Kncelados con tu producto. Guión, grabación y edición a cargo de Kncelados.",
  },
  {
    label: "Patrocinar sección",
    desc: "Tu marca patrocina una sección fija del podcast (por ejemplo, la de chistes) con mención directa. Sale íntegra en el capítulo largo y además como short independiente en todas las plataformas.",
  },
  {
    label: "Product placement",
    desc: "Tu marca entra integrada de forma natural en el episodio semanal de ~90 minutos. El contenido queda asociado a todos los vídeos cortos de ese episodio, multiplicando el alcance toda la semana.",
  },
];

/** Email comercial de KNCELADOS (fuente: MediaKit 2026). */
export const contactEmail = "hola@kncelados.com";

export interface Metric {
  value: string;
  label: string;
  source: string;
}

/** Métricas reales (fuente: MediaKit 2026, "últimos 28 días" salvo indicado).
 *  Se publican solo cifras que figuran en el kit; no se inventa nada. */
export const metrics: Metric[] = [
  { value: "150K", label: "suscriptores", source: "YouTube" },
  { value: "35K", label: "escuchas/mes", source: "Spotify" },
  { value: "493K", label: "seguidores", source: "Instagram" },
  { value: "443K", label: "seguidores", source: "TikTok" },
  { value: "113K", label: "seguidores", source: "Facebook" },
  { value: "3,9M", label: "visualizaciones Shorts", source: "YouTube" },
  { value: "10,5M", label: "visualizaciones", source: "Instagram" },
  { value: "8,2M", label: "visualizaciones", source: "TikTok" },
  { value: "2,9M", label: "visualizaciones", source: "Facebook" },
  { value: "850K", label: "reproducciones acumuladas", source: "Spotify" },
];

export interface CaseStudy {
  brand: string;
  logo: string;
  what: string;
  format: string;
  content: string;
  result?: {
    metric: string;
    value: string;
    source: string;
  };
}

/** Casos de éxito. Vacío a propósito: solo se publica información real.
 *  Nada de placeholders a la vista. */
export const caseStudies: CaseStudy[] = [];

export interface PlatformFollowers {
  id: "instagram" | "tiktok" | "youtube" | "facebook";
  followers: number;
}

/** Seguidores por plataforma (cifras actuales aportadas por el equipo, sept. 2026).
 *  Valores numéricos: la presentación la hace el front, y `totalFollowers` se
 *  recalcula solo. */
export const platformFollowers: PlatformFollowers[] = [
  { id: "instagram", followers: 459_000 },
  { id: "tiktok", followers: 502_000 },
  { id: "youtube", followers: 152_000 },
  { id: "facebook", followers: 123_000 },
];

/** Suma real de seguidores (IG + TikTok + YT + FB). No se hardcodea. */
export const totalFollowers = platformFollowers.reduce(
  (sum, p) => sum + p.followers,
  0,
);

export interface SpotifyMetric {
  value: string;
  label: string;
  dynamic: boolean;
}

/** Spotify se muestra aparte: son escuchas, no seguidores (no suma al total). */
export const spotifyMetric: SpotifyMetric = {
  value: "35K",
  label: "escuchas/mes",
  dynamic: true,
};

export interface AudienceFact {
  title: string;
  desc: string;
  confirmed: boolean;
}

/** Hechos de audiencia (fuente: MediaKit 2026). Son cualidades de la audiencia,
 *  no contadores de followers (sección "Nuestra audiencia"). `confirmed` marca
 *  qué hechos vienen del kit (verdad conocida) frente a futuros pendientes. */
export const audienceFacts: AudienceFact[] = [
  {
    title: "25-34 años",
    desc: "La franja dominante en todas las plataformas (34-40% del público).",
    confirmed: true,
  },
  {
    title: "España",
    desc: "75% del público de YouTube y 91% del de Spotify es español.",
    confirmed: true,
  },
  {
    title: "+90 min",
    desc: "Capítulo largo semanal que la gente consume entero, no troceado.",
    confirmed: true,
  },
  {
    title: "Comunidad activa",
    desc: "846K interacciones en IG, 96K likes en shorts: comentan y comparten.",
    confirmed: true,
  },
];

export interface CollabConcept {
  title: string;
  desc: string;
}

/** Conceptos de colaboración (brief del rediseño de /contacto). Los formatos
 *  concretos ya viven en `formats`; aquí está la conversación, no el catálogo. */
export const collabConcepts: CollabConcept[] = [
  {
    title: "Contenido",
    desc: "Vídeo corto, sección patrocinada o product placement natural. El formato se elige con tu marca, no en tu contra.",
  },
  {
    title: "Redes",
    desc: "Una campaña cruza TikTok, Instagram, YouTube y Spotify. Tu marca habla donde la gente ya está.",
  },
  {
    title: "Acciones",
    desc: "Lanzamientos, sorteos y sorpresas. Lo hecho con humor y sin guion es lo que la gente recuerda.",
  },
  {
    title: "Ideas",
    desc: "¿Tienes una idea rara? Cuéntanosla. En Kncelados, la rara suele ser la buena.",
  },
];

/** Mensaje central de la sección de colaboraciones (brief del rediseño).
 *  Se parte en dos para destacar solo el final en el acento de marca. */
export const collabPhilosophyLead =
  "No queremos meter un anuncio dentro de un podcast.";
export const collabPhilosophyAccent =
  "Queremos meter tu marca dentro de la conversación.";