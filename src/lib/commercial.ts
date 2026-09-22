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