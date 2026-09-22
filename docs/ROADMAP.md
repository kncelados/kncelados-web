# ROADMAP.md

> Lista de hitos pequeños. Se actualiza al cerrar cada hito (ver AGENTS.md).
> Estado: `pendiente` / `en progreso` / `bloqueado` / `hecho`.

| ID | Hito | Estado | Depende de | Riesgo | Criterio de aceptación |
|---|---|---|---|---|---|---|
| H0 | Rellenar `ARCHITECTURE.md`: QR, export GSC, trailingSlash, URLs nuevo repo/Vercel | hecho | — | — | Secciones completas |
| H1 | Upgrade Astro 5.14.6 → 7.1.6 + adapter swap Netlify → Vercel + Tailwind 4.0.3 → 4.3.3 | hecho | — | medio | Build pasa, todas las páginas responden 200, 0 errores astro check |
| H2 | Migrar Tailwind v3 → v4 (config CSS-first) | hecho | H1 | **alto** | Ya estaba v4.0.3 antes del upgrade; el proyecto nunca usó v3. Actualizado a 4.3.3 como parte de H1 |
| H3 | Verificar scripts de scrape y mystery QR tras upgrade | hecho | H1 | bajo | Los 4 scripts (`scrape:episodes`, `scrape:collections`, `scrape:shorts`, `mystery:qr`) ejecutan sin errores |
| H4 | Portar componentes de la home rediseñada al proyecto actualizado | hecho | H2 | bajo | Home nueva portada manualmente sobre `migration`; verificación build/lint + visual |
| | └ H4.1 Hacer el menú (Navbar mobile/desktop) | hecho | — | — | Menú funcional en todas las resoluciones |
| | └ H4.2 Ajustar versión móvil | hecho | H4.1 | — | Responsive verificado en todas las secciones |
| | └ H4.3 Finalizar sección Colabora en la home | hecho | — | — | Sección con contenido real (placeholder actual → diseño final) |
| H5 | Migrar repo a nuevo GitHub exclusivo de kncelados (`github.com/kncelados/kncelados-web`) | hecho | H3, H4 | medio | Código completo en nuevo repo, commit inicial limpio (sin historial previo) |
| H6 | Deploy a Vercel + verificación manual | hecho | H5 | medio | Deploy funciona desde nuevo repo, todas las páginas responden 200, usuario verifica visualmente |
| H7 | Corte DNS en IONOS (Netlify se mantiene como respaldo hasta confirmar) | hecho | H6 | **alto** | `www.kncelados.com` sirve desde Vercel; tras confirmar, usuario borra Netlify manualmente. Además: registros de email (MX/SPF/autodiscover), `tienda` (Shopify) y `google-site-verification` recreados en Vercel DNS; envío/recepción de email verificado por el usuario |
| H8 | Revisión post-migración + borrado de Netlify | pendiente | H7 | bajo | **Recordatorio: ~28/08/2026** (2 semanas desde el corte del 14/08). Si no se detectan errores (web, email, tienda), borrar el proyecto/site de Netlify manualmente |
| H9 | Web comercial — Fase 1: landing `/contacto` real, nav sin páginas WIP, hero con micro-contexto, home reordenada, endpoint de contacto (Resend) y title/description de home reales | hecho | H7 | bajo | Verificación (hecha el 22/09/2026): `astro check` 0 errores, `bun run build` completo, `/`, `/contacto`, `/podcast`, `/tienda` 200, POST `/api/contact` responde 503 hasta configurar env vars |
| | └ F1.1 Landing `/contacto` (formulario + formatos + media kit 2024) | hecho | — | — | Página sirve 200, formulario con estados, sin placeholders visibles |
| | └ F1.2 Nav sin WIP (Header + Footer) | hecho | — | — | Nav = Inicio, Podcast, Colabora, Tienda, Descargas |
| | └ F1.3 Micro-contexto en hero | hecho | — | — | "El podcast de humor sin filtros" + "Cada lunes a las 20:00 h" bajo el logo |
| | └ F1.4 Home reordenada (Hero→Next→Welcome→Expisodios→Marcas→Colabora→Casos→Mug→CTA final) | hecho | — | — | Bloque de casos oculto hasta tener datos reales |
| | └ F1.5 Endpoint `POST /api/contact` → Resend | hecho | — | — | Valida campos, 503 sin env vars, no rompe el site |
| | └ F1.6 Title/description reales en home | hecho | — | — | Ya no se sirve `<title></title>` ni meta vacía |
| H10 | Web comercial — Fase 2 técnica: canonical + og:url dinámicos por página y manifest coherente con el tema | hecho | H9 | bajo | Verificación (hecha el 22/09/2026): canon=1 por página (`/`, `/contacto`, `/descargas`, `/podcast`) apuntando a `https://www.kncelados.com<ruta>`, og:url dinámico, `astro check` 0 errores, build completo. Eliminada la duplicación de canonical/og que generaba el `slot="head"` de `/descargas` |
| | └ F2.1 Canonical + og:url dinámicos en `Layout.astro` | hecho | — | — | 1 solo canonical por página; og:url ya no queda fijo a la home |
| | └ F2.2 Quitar canonical/og hardcodeados de `/descargas` | hecho | — | — | Sin duplicados meta en HTML servido |
| | └ F2.3 `manifest.json` → `#03030A` | hecho | — | — | `theme_color`/`background_color` alineados con `dark-950` |
| H11 | Web comercial — Fase 3 (comercial): métricas agregadas, 2-3 casos de éxito, formato por marca confirmado, media kit 2026 | pendiente | H10 | bajo | **Parcialmente desbloqueado (22/09/2026):** datos del MediaKit 2026 aportados por el cliente. Hecho: métricas reales en home, 3 formatos confirmados (sin precios), email `hola@kncelados.com`, media kit público (`/knc-media-kit-publico-2026.pdf`). **Sigue bloqueado:** casos de éxito reales (2-3) con resultados. Verificación pendiente: `astro check` + build + revisión visual |

> **Nota futura:** próximas iteraciones requerirán Supabase y Resend para nuevas
> secciones y páginas. Fuera de alcance del roadmap actual — queda como constancia.
> (`Resend` ya en uso parcial: env vars `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL`.)
