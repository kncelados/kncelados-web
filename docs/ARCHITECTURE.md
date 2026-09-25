# ARCHITECTURE.md

> Fuente de verdad del estado técnico real del proyecto. Se actualiza al cerrar cada
> hito (ver AGENTS.md). Si un dato no está aquí, no se asume — se pregunta.

## Stack — estado actual (post-upgrade H1, rama `migration`)

- Astro: 7.1.6
- Vite: 8.2.0
- Tailwind: 4.3.3 (CSS-first via `@tailwindcss/vite`)
- Hosting producción: Vercel (corte DNS completado, H7)
- Adapter código: @astrojs/vercel 11.0.4
- Gestor de paquetes: bun
- Repo: `https://github.com/verdulife/kncelados-web`
- Repo: `https://github.com/kncelados/kncelados-web` (migración H5 ✓)
- Autenticación: HTTPS + GitHub Personal Access Token (clásico, scope `repo`, 90 días expiry)
- Cloudflare WARP bloquea SSH en este equipo — usar siempre HTTPS

## Formulario de contacto (/contacto) — H9

- Endpoint `POST /api/contact` (SSR, `output: server` + adapter Vercel) en `src/pages/api/contact.ts`. Usa `fetch` directo a `https://api.resend.com/emails` — sin dependencia npm.
- Env vars requeridas (documentadas en `.env.example`):
  - `RESEND_API_KEY` — API key de Resend.
  - `CONTACT_EMAIL` — email destino de los formularios. Valor real confirmado (MediaKit 2026): `hola@kncelados.com`.
  - `CONTACT_FROM_EMAIL` — opcional; si se omite el from es `Kncelados Web <CONTACT_EMAIL>`.
- Sin env vars el endpoint responde **503 JSON** y declara el formulario como no configurado; el site no se rompe. Validación: nombre, email y mensaje obligatorios; email con regex básica.
- Datos de formatos y casos en `src/lib/commercial.ts`. `caseStudies` está **vacío a propósito** (sin datos reales el bloque de casos de la home no se pinta). Formatos y métricas reales del **MediaKit 2026** (fuente: `docs/research/mediakit-2026.md`).
- Media kit público en `/knc-media-kit-publico-2026.pdf` (dossier 2026 **sin precios**, generado a partir de los datos del kit; el PDF original con precios NO se sirve en la web). Fuera `public/knc_dossier-web_2024.pdf` (obsoleto, no referenciado).
- Nav actual (Header + Footer): Inicio, Podcast, Colabora, Tienda, Descargas — Knsultorio/Eventos/KnCine Awards quedaron fuera por estar en construcción.

## Formulario del Knsultorio (/knsultorio) — activación Resend (23/09)

- El formulario de `src/pages/knsultorio/index.astro` hace `POST /api/knsultorio` (`src/pages/api/knsultorio.ts`), que ya envía por Resend a `knsultorio@gmail.com` con `reply_to` del usuario.
- Env vars necesarias (documentadas en `.env.example`): `RESEND_API_KEY`, `CONTACT_EMAIL` (`hola@kncelados.com`), `CONTACT_FROM_EMAIL`. Localmente en `.env` (gitignored); en Vercel pendiente de cargar.
- **Dominio del remitente**: decisión del usuario (23/09) = verificar el **subdominio `mail.kncelados.com`** en Resend para NO tocar el SPF del dominio raíz (`v=spf1 include:_spf-eu.ionos.com ~all`, MX `mx00/mx01.ionos.es`, correo IONOS intacto). El from en producción será `Kncelados <hola@mail.kncelados.com>`.
- **Pendiente (bloqueante, lo hace el usuario en Resend)**: verificar `mail.kncelados.com` (DKIM TXT `resend._domainkey.mail`, TXT `mail` = `v=spf1 include:spf.resend.com ~all`, y MX/CNAME de tracking si Resend lo pide, todo en Vercel DNS). Sin dominio verificado Resend solo permite enviar al email de la cuenta (`kncelados@gmail.com`); el endpoint responde 502. La API key ya probada (**HTTP 200** enviando a `kncelados@gmail.com`).

## Landing "Colabora" (/contacto) — H13

- Página en 5 secciones tras el feedback del usuario (23/09/2026): **Hero** (TU MARCA TAMBIÉN TIENE SITIO AQUÍ, **centrado en columna única con padding amplio** — texto arriba, `public/foto-colabora.png` abajo con `max-w-3xl`), **Nuestros números** (4 plataformas en una línea, tipografía Boldonse, cifras `lg:text-6xl`), **Nuestra audiencia**, **Colaboraciones** (`JUNTOS` y el final de la frase en acento) y **CTA final** (botón CONTACTAR → `mailto:hola@kncelados.com`, total `+1,2M SEGUIDORES` en una línea y mismo tamaño).
- Los datos viven en `src/lib/commercial.ts`: `platformFollowers` (IG 459K, TikTok 502K, YT 152K, FB 123K — cifras actuales aportadas por el equipo, sept. 2026), `totalFollowers` (suma calculada → +1,2M), `spotifyMetric` (35K escuchas/mes, dinámica, NO suma al total), `audienceFacts` (4 hechos con flag `confirmed`), `collabConcepts` y `collabPhilosophyLead`/`collabPhilosophyAccent`. Nada de cifras hardcodeadas: si cambia `platformFollowers`, el total se recalcula solo.
- Iconos de red en `src/lib/assets/`: Instagram, Tiktok, Youtube, **Facebook (nuevo H13)**, Spotify.
- El formulario y `¿HABLAMOS?` se eliminaron de la página por decisión del usuario: el contacto es un botón mailto. El endpoint `POST /api/contact` (Resend, H9) se conserva en el repo **sin uso** en `/contacto`.
- La foto de grupo `public/foto-colabora.png` (1724×912) sustituyó al antiguo collage de 6 retratos.

## KnCine Awards —Películas de la home

- Las películas mostradas en la home se centralizan en `src/lib/kncine.ts` mediante la interfaz `KncineEntry` (`title`, `src`, `alt`).
- `src/sections/KncineAwarads.astro` renderiza el carrusel usando esa lista y paginación automática de seis tarjetas por página.
- *Infiltrados* (*The Departed*) forma parte de la selección desde H15 y usa el póster aportado por el usuario en `public/infiltrados.png`.

## Stack — estado destino

- Astro: 7.1.6 ✓
- Vite: 8.2.0 ✓
- Tailwind: 4.3.3 ✓
- Hosting destino: Vercel (completado: deploy + DNS + redirects) ✓

## Elementos que NO se pueden romper

> Rellenar antes de empezar cualquier hito de upgrade/migración. Mientras esta sección
> esté vacía, no se debe modificar ninguno de estos puntos sin aprobación explícita.

- **URLs con QR impresos**: `<pendiente — listar cada URL y dónde está el QR físico>`
- **URLs indexadas con autoridad (export de Search Console)**: `<pendiente — adjuntar/enlazar el export>`
- **Redirects actuales** (de `_redirects` / `netlify.toml`): `<pendiente>`
- **`trailingSlash` actual**: `<pendiente — con o sin barra final>`

## Decisiones tomadas (log, no se re-discuten sin motivo)

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-08-04 | Upgrade manual (no `@astrojs/upgrade`) | Adapter swap requiere `bun remove`/`bun add`; `@astrojs/upgrade` no soporta bun nativamente ni swap de adapters |
| 2026-08-04 | Adapter swap incluido en H1 | `@astrojs/netlify` v6 no es compatible con Astro 7; más limpio saltar directo a Vercel que upgrade Netlify v6→v8 primero |
| 2026-08-04 | Node engine fijado a `24.x` | Es la última LTS soportada por Vercel (default) |
| 2026-08-04 | `compressHTML` default `'jsx'` (v7) | Confiar en el nuevo default; verificar visualmente y revertir a `true` si hay espacios perdidos |
| 2026-08-05 | Ramas `rework` y `rollback-39` son código basura, se borrarán; no usar como referencia | Evita copiar de una rama descartada |
| 2026-08-05 | H4 se porta manualmente sobre `migration` (usuario copia componentes) | Preferencia del usuario; sin trabajo previo en H4 |
| 2026-08-10 | `trailingSlash` se mantiene en default `'ignore'` | Sirve ambas versiones (con/sin `/`) sin forzar redirects; evita perder ranking de URLs indexadas con `/` |
| 2026-08-10 | Sitemap filtra URLs `/player/` con `filter` function | Refuerzo de la exclusión indexada en `robots.txt` (no solo en robots, también en sitemap) |
| 2026-08-10 | No se crea `vercel.json` | No hay redirects custom más allá del www↔apex que va por DNS |
| 2026-08-13 | Autenticación con HTTPS + PAT clásico en lugar de SSH | Cloudflare WARP en este equipo bloquea/rompe el handshake SSH después del key exchange; HTTPS con credential manager es fiable |
| 2026-08-14 | Nameservers de IONOS → Vercel (`ns1/ns2.vercel-dns.com`) para `kncelados.com` | Corte de DNS completado (H7); la web la sirve Vercel |
| 2026-08-14 | Registros de email recreados en Vercel DNS (MX `mx00`/`mx01.ionos.es` prio 10, TXT SPF `include:_spf-eu.ionos.com`, CNAME `autodiscover` → `adsredir.ionos.info`) | Al cambiar nameservers se pierden los registros DNS de IONOS; sin MX/SPF el email no funciona. No existían DKIM ni DMARC en IONOS → no se añadieron |
| 2026-08-14 | Registros auxiliares recreados en Vercel DNS: CNAME `tienda` → `shops.myshopify.com`, TXT `google-site-verification=0xkX...` | `tienda.kncelados.com` (Shopify) sigue activa; la TXT mantiene verificada la propiedad de dominio en Search Console |
| 2026-08-14 | No se añadieron a Vercel las A/AAAA de IONOS (`217.160.0.40`) ni CNAME `_domainconnect` | Son la IP de hosting antigua (rompería la web) y un registro de gestión interna de IONOS |
| 2026-09-22 | Páginas WIP (Knsultorio, Eventos, KnCine Awards) ocultas de la nav (Header + Footer) | Decisión del usuario: no enlazar páginas en construcción; se recuperan cuando existan |
| 2026-09-22 | Order home comercial: Hero→Next→Welcome→Últimos episodios→Marcas→Colabora→Casos→Mug→CTA final | Decisión del usuario sobre la jerarquía comercial de la home (Fase 1) |
| 2026-09-22 | Formulario de contacto con endpoint propio + Resend (fetch directo, sin paquete npm) | Decisión del usuario; menos dependencias y control del validado |
| 2026-09-22 | Home pasa `title`/`description` reales al `Layout` (antes vacíos: `<title></title>`) | P0 de la auditoría: SEO on-page; copy factual, sin métricas inventadas |
| 2026-09-22 | Canonical + og:url dinámicos por página en `Layout.astro` (`new URL(Astro.url.pathname, SITE)`) | P1-6 de la auditoría: antes `og:url` fijo a la home y sin canonical global; se eliminó la duplicación del `slot="head"` de `/descargas` |
| 2026-09-22 | `manifest.json` pasa a `#03030A` (antes `#060d14` azul antiguo) | Alinear PWA con el tema real `dark-950` |
| 2026-09-22 | Métricas y formatos del MediaKit 2026 publicados en la web (sin precios); bloque de métricas dentro de Collaborations en la home | Datos reales del kit aportado por el cliente; el PDF con precios NO es descargable (decisión del usuario) |
| 2026-09-22 | Media kit público en `/knc-media-kit-publico-2026.pdf`; eliminado `knc_dossier-web_2024.pdf` y su enlace | Dossier 2026 sin precios como descargable público; no exponer la versión de negociación con precios |
| 2026-09-22 | Email comercial confirmado: `hola@kncelados.com` (de `CONTACT_EMAIL` en el formulario y visible en `/contacto`) | Fuente: MediaKit 2026, págs. 1 y 7 |
| 2026-09-23 | Orden home (H12): Hero→Next→Welcome→Episodios→Colabora→Marcas→Knsultorio→Mug→Mystery→KnCine→Stats→MeteTuMarca→CTA final (13 secciones) | Reestructuración aprobada por el usuario (FASE 1); sustituye al orden de 9 secciones de H9 |
| 2026-09-23 | Claim Hero a `text-xl lg:text-2xl`; botones Hero `px-12 py-4` | Elecciones explícitas del usuario vía tool question (FASE 2) |
| 2026-09-23 | Welcome: "Cuatro amigos, un podcast, cero filtros" + iconos de la red (YouTube/Spotify/Instagram/TikTok) en los 4 `Link` | Copy e iconos aprobados por el usuario (FASE 4); usa la prop `icon` de `Link.astro` |
| 2026-09-23 | Slider "Episodios recientes" muestra las 15 cards más recientes (`slice(0, 15)`); spacer final eliminado | Con 5 cards no había desbordamiento → flechas/drag no-op; decisión de conteo del usuario: "15 más recientes" |
| 2026-09-23 | Logo header pierde el glow al abrir el menú (clase `.no-shadow`, transición 500ms) | Sombra 10px sobre el panel oscuro del menú abierto se veía sucia (FASE 2) |
| 2026-09-23 | Meta description de home: se mantiene "Más de 150K suscriptores" | Decisión del usuario: copy SEO factual, no visible en página |
| 2026-09-23 | Landing "Colabora" (`/contacto`) rediseñada en 5 secciones (Hero, Números, Audiencia, Colaboraciones, CTA final); el formulario y su endpoint quedan intactos | Hito H13 aprobado por el usuario (rediseño de `/contacto`); media kit como enlace secundario en el CTA final |
| 2026-09-23 | Números publicados del MediaKit 2026: IG 493K · TikTok 443K · YT 150K · FB 113K · Spotify 35K escuchas/mes · total 1,2M (suma) | Usuario eligió "MediaKit 2026 si hay dudas"; el IG real verificable online (~458K) está más cerca del kit (493K) que del brief |
| 2026-09-23 | Datos de la landing centralizados en `commercial.ts`: `platformFollowers`, `totalFollowers` (calculado por suma), `spotifyMetric` (dinámica), `audienceFacts` (flag `confirmed`), `collabConcepts` | El total se recalcula solo si cambian las cifras; las páginas no llevan números hardcodeados (preparado para datos dinámicos) |
| 2026-09-23 | Audiencia publicada como "25-34 años" (MediaKit 2026) en lugar de "18-34" (brief) | El kit confirma 25-34 dominante en todas las plataformas (34-40%); criterio del usuario: "si dudas, usa el MediaKit" |
| 2026-09-23 | Hero con collage de los 6 retratos de `public/`; foto de grupo pendiente del usuario | No existe foto de grupo; al recibirla se sustituye el bloque collage (sin romper la página) |
| 2026-09-23 | Nuevo icono `src/lib/assets/Facebook.astro` | Faltaba el logo de Facebook para "Nuestros números"; patrón de `Instagram.astro`/`Tiktok.astro` (fill `currentColor`, `Astro.props.class`)
| 2026-09-23 | `/contacto`: fuera el formulario (5 campos + `<script>` de envío), `¿HABLAMOS?`, `HABLEMOS SIN COMPROMISO` y el enlace de descarga del media kit; CTA final = único botón CONTACTAR `mailto:hola@kncelados.com`. `POST /api/contact` se mantiene en el repo sin uso | Decisión del usuario (feedback visual sobre la landing): contacto directo por email, más óptimo que el formulario |
| 2026-09-23 | Hero sin etiqueta `[ Colabora ]` y con foto única `public/foto-colabora.png` (foto de grupo entregada) en `aspect-video rotate-1`; texto-izquierda / imagen-derecha | Feedback del usuario; sustituye al collage de 6 retratos |
| 2026-09-23 | Números en una sola línea (`grid-cols-4`, compacto en móvil) con tipografía Boldonse (incluido el total `+1,2M`); fuera la nota "los que importan, del MediaKit 2026" | Feedback del usuario (los números eran el punto más flojo de la landing) |
| 2026-09-23 | `platformFollowers` actualizado a cifras del equipo (IG 459K, FB 123K, TikTok 502K, YT 152K) — el total se recalcula solo a +1,2M | Cifras "live" aportadas por el usuario el 23/09/2026; `metrics` (MediaKit) queda intacto en `commercial.ts` sin mostrarse |
| 2026-09-23 | Filosofía de colaboración: `collabPhilosophyLead`/`collabPhilosophyAccent` separados; en página texto blanco, interlineado `leading-[1.05]`, solo "Queremos meter tu marca dentro de la conversación" en acento | Feedback del usuario sobre la cita central de la landing |
| 2026-09-23 | Hero de `/contacto` centrado en columna única (texto arriba / foto abajo, como el de la home) con más padding: `pt-44 pb-28` / `lg:pt-56 lg:pb-36`, `gap-16`, texto `text-center` y foto `max-w-3xl` (mantiene `aspect-video rotate-1`) | Feedback ronda 2 del usuario: "más padding y que quede centrado" (el hero iba en split texto-izquierda/imagen-derecha) |
| 2026-09-23 | Números de plataforma en "Nuestros números" un punto más pequeños: `text-2xl lg:text-7xl` → `lg:text-6xl`; bloque total en una sola línea `+1,2M SEGUIDORES` con el mismo tamaño (`text-4xl lg:text-6xl`, SEGUIDORES en acento) | Feedback ronda 2 del usuario: números "un poco más pequeños" y total "en una línea, mismo tamaño" |
| 2026-09-23 | Resend para el Knsultorio: verificar el **subdominio `mail.kncelados.com`** (no tocar el SPF del dominio raíz); from = `Kncelados <hola@mail.kncelados.com>` | Decisión del usuario (vía Telegram): prefiere no tocar el SPF de `kncelados.com` que ya incluye IONOS |
| 2026-09-23 | `RESEND_API_KEY` cargada en `.env` local (gitignored) y key probada vía directa a Resend (HTTP 200, envío a `kncelados@gmail.com`) | Configurar el envío real del formulario del Knsultorio; sin dominio verificado Resend limita el envío al email de la cuenta |

## Estado del upgrade

- [x] Astro actualizado a 7.1.6 (rama `migration`, sin merge a master)
- [x] Vite actualizado a 8.2.0 (viene con Astro 7)
- [x] Tailwind v3 → v4 migrado (ya estaba v4.0.3; actualizado a 4.3.3 junto con Astro 7)
- [x] Adapter Netlify → Vercel (swap directo: `@astrojs/vercel` 11.0.4)
- [x] Scripts de scrape y mystery QR verificados tras upgrade (H3): `scrape:episodes`, `scrape:collections`, `scrape:shorts`, `mystery:qr` — ejecutan sin errores, JSON/SVG válidos, árbol restaurado a limpio
- [x] Home rediseñada portada al proyecto actualizado (H4)
- [x] Repo migrado a `https://github.com/kncelados/kncelados-web` (H5)
- [x] Deploy de prueba en Vercel (preview) validado contra checklist de URLs
- [x] Redirects/robots/sitemap replicados en `vercel.json`
- [x] Corte de DNS realizado (nameservers IONOS → Vercel, H7) + email restaurado (MX/SPF/autodiscover) + `tienda` y `google-site-verification` recreados
