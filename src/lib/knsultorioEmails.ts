const ESC_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ESC_ENTITIES[char] ?? char);

const ACCENT = "#D3111B";
const BG = "#03030A";
const PANEL = "#0b0d14";
const TEXT = "#F7F9FA";
const MUTED = "#9aa0ae";
const BORDER = "rgba(255,255,255,0.14)";

const shell = (inner: string) => `
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${BG};border:1px solid ${BORDER};border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;background:${PANEL};">
                <div style="font-size:20px;font-weight:900;letter-spacing:1px;text-transform:uppercase;color:${TEXT};">
                  <span style="color:${ACCENT};">[</span>Knsultorio<span style="color:${ACCENT};">]</span>
                </div>
              </td>
            </tr>
            ${inner}
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${BORDER};">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">
                  KncELADOS · <a href="https://kncelados.com" style="color:${ACCENT};text-decoration:none;">kncelados.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

function field(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 0;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">${label}</div>
        <div style="font-size:15px;line-height:1.5;color:${TEXT};">${value}</div>
      </td>
    </tr>
  `;
}

export interface KnsultorioFields {
  nombre: string;
  email: string;
  mensaje: string;
}

export function knsultorioNotificationHtml({ nombre, email, mensaje, fecha }: KnsultorioFields & { fecha: string }) {
  const body = `
    <tr>
      <td style="padding:32px;">
        <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${ACCENT};font-weight:700;">Nuevo mensaje</div>
        <div style="margin:8px 0 4px;font-size:26px;line-height:1.2;font-weight:900;color:${TEXT};">Alguien ha escrito<br/>al Knsultorio</div>
        <div style="margin-bottom:20px;font-size:13px;color:${MUTED};">${escapeHtml(fecha)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PANEL};border:1px solid ${BORDER};border-radius:16px;padding:4px 20px;">
          ${field("Nombre", escapeHtml(nombre))}
          ${field("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(email)}</a>`)}
          ${field("Mensaje", escapeHtml(mensaje).replace(/\n/g, "<br/>"))}
        </table>
        <div style="margin-top:16px;font-size:13px;color:${MUTED};line-height:1.5;">
          Responde desde aquí mismo a <strong style="color:${TEXT};">${escapeHtml(email)}</strong> y el mensaje irá directo al remitente.
        </div>
      </td>
    </tr>
  `;
  return shell(body);
}

export function knsultorioThankYouHtml({ nombre }: { nombre: string }) {
  const body = `
    <tr>
      <td style="padding:32px;">
        <div style="font-size:26px;line-height:1.2;font-weight:900;color:${TEXT};">¡Gracias, ${escapeHtml(nombre)}!</div>
        <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:${MUTED};">
          Hemos recibido tu mensaje. Lo leemos con calma y te respondemos
          <strong style="color:${TEXT};">por aquí</strong> o por redes.
        </p>
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid ${BORDER};">
          <div style="font-size:14px;color:${TEXT};">El equipo de KNCELADOS</div>
          <div style="margin-top:6px;font-size:13px;color:${MUTED};">gracias por formar parte de la conversación</div>
        </div>
      </td>
    </tr>
  `;
  return shell(body);
}