import type { APIRoute } from "astro";

export const prerender = false;

const RESEND_URL = "https://api.resend.com/emails";

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

interface ContactPayload {
  nombre?: string;
  empresa?: string;
  email?: string;
  tipo?: string;
  mensaje?: string;
}

function html({ nombre, empresa, email, tipo, mensaje }: RequiredFields) {
  return `
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Empresa:</strong> ${empresa || "—"}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Tipo de colaboración:</strong> ${tipo || "—"}</p>
    <hr/>
    <p><strong>Mensaje:</strong></p>
    <p>${mensaje}</p>
  `;
}

type RequiredFields = ContactPayload & {
  nombre: string;
  email: string;
  mensaje: string;
};

export const POST: APIRoute = async ({ request }) => {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Cuerpo inválido." }, 400);
  }

  const nombre = body.nombre?.trim() ?? "";
  const empresa = body.empresa?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const tipo = body.tipo?.trim() ?? "";
  const mensaje = body.mensaje?.trim() ?? "";

  if (!nombre || !email || !mensaje) {
    return json({ error: "Nombre, email y mensaje son obligatorios." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Ese email no parece un email." }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    return json(
      { error: "Formulario no configurado todavía." },
      503,
    );
  }

  const from = import.meta.env.CONTACT_FROM_EMAIL ?? `Kncelados Web <${to}>`;

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      reply_to: [email],
      to: [to],
      subject: `Colaboración Kncelados [${tipo || "sin tipo"}] — ${empresa || nombre}`,
      html: html({ nombre, empresa, email, tipo, mensaje }),
    }),
  });

  if (!res.ok) {
    return json({ error: "No ha llegado. Reinténtalo o escríbenos por redes." }, 502);
  }

  return json({ ok: true }, 200);
};