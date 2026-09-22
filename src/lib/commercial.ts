export interface CollaborationFormat {
  label: string;
  desc: string;
}

/** Formatos ofrecidos. La disponibilidad real de cada uno se confirma en
 *  conversación; por eso la página no declara ninguno como "activo" hasta que
 *  el cliente lo confirme. No se inventa ningún formato ni resultado. */
export const formats: CollaborationFormat[] = [
  {
    label: "Patrocinio de episodio",
    desc: "Tu marca coprotagoniza un episodio sin romper el ritmo de la conversación.",
  },
  {
    label: "Integración de producto",
    desc: "Tu producto entra en directo, con la naturalidad (o el caos) del grupo de WhatsApp.",
  },
  {
    label: "Branded content",
    desc: "Contenido hecho a medida para tu marca en el tono KNCELADOS. Sin guion corporativo.",
  },
  {
    label: "Clips patrocinados",
    desc: "Vertical, corto y con gancho: el formato que ya suma millones de reproducciones.",
  },
  {
    label: "Redes sociales",
    desc: "Presencia en IG, TikTok y Telegram dentro de una comunidad que espera cada lunes.",
  },
  {
    label: "Eventos",
    desc: "Actividades en directo y experiencias para tu marca y su gente.",
  },
  {
    label: "Acciones especiales",
    desc: "Locuras puntuales que no caben en ningún formato estándar. Cuéntanos la tuya.",
  },
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