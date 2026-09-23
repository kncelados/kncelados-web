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
