import type { APIRoute } from "astro";
import {
  knsultorioNotificationHtml,
  knsultorioThankYouHtml,
} from "@/lib/knsultorioEmails";

export const prerender = false;

const RESEND_URL = "https://api.resend.com/emails";
const KNSULTORIO_TO = "knsultorio@gmail.com";

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

interface KnsultorioPayload {
  nombre?: string;
  email?: string;
  mensaje?: string;
}

type RequiredFields = KnsultorioPayload & {
  nombre: string;
  email: string;
  mensaje: string;
};

async function sendEmail(
  apiKey: string,
  { from, to, reply_to, subject, html }: Record<string, string | string[]>,
) {
  return fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from, to, reply_to, subject, html }),
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: KnsultorioPayload;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Cuerpo inválido." }, 400);
  }

  const nombre = body.nombre?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const mensaje = body.mensaje?.trim() ?? "";

  if (!nombre || !email || !mensaje) {
    return json({ error: "Nombre, email y mensaje son obligatorios." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Ese email no parece un email." }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from =
    import.meta.env.CONTACT_FROM_EMAIL ?? import.meta.env.CONTACT_EMAIL;
  if (!apiKey || !from) {
    return json({ error: "Formulario no configurado todavía." }, 503);
  }

  const fields: RequiredFields = { nombre, email, mensaje };
  const fecha = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  const notification = await sendEmail(apiKey, {
    from,
    reply_to: [email],
    to: [KNSULTORIO_TO],
    subject: `Nuevo mensaje desde el Knsultorio · ${nombre}`,
    html: knsultorioNotificationHtml({ ...fields, fecha }),
  });

  if (!notification.ok) {
    return json(
      { error: "No ha llegado. Reinténtalo o escríbenos por redes." },
      502,
    );
  }

  const thanks = await sendEmail(apiKey, {
    from,
    to: [email],
    subject: "Gracias por escribir a Knsultorio",
    html: knsultorioThankYouHtml({ nombre }),
  });

  if (!thanks.ok) {
    console.error("knsultorio: no se pudo enviar el email de gracias", thanks.status);
  }

  return json({ ok: true }, 200);
};
