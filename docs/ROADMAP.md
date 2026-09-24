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
| H12 | Reestructuración home a 13 secciones + ajustes FASE 2-6 + fix overflow slider | hecho | H11 | bajo | Verificación (23/09/2026): `astro check` 0 errores, `bun run build` completo, home sirve 200 con las 13 secciones, slider pinta 15 cards (artículos 6→16). Feature doc: `odd/tasks/fase1-reestructuracion-home.md` |
| | └ Orden nuevo: Hero→Next→Welcome→Episodios→Colabora→Marcas→Knsultorio→Mug→Mystery→KnCine→Stats→MeteTuMarca→CTA | hecho | — | — | Copy nuevo: claim Hero `text-xl/lg:text-2xl`, botones `px-12 py-4`, Welcome "Cuatro amigos… cero filtros" con iconos de red, MARCA en rojo, header sin sombra con menú abierto |
| | └ FIX slider "Episodios recientes": `slice(0,5)` → `slice(0,15)` | hecho | — | — | Con 5 cards no había desbordamiento y el slider no deslizaba; 15 cards ≈ 5800px desbordan en pantallas reales |

| H13 | Web comercial — Landing "Colabora" (`/contacto`) rediseñada | hecho | H11 | bajo | Verificación (23/09/2026): `astro check` 0 errores, `bun run build` completo, `/contacto` 200. Cifras actuales (IG 459K, FB 123K, TikTok 502K, YT 152K, total 1,2M) y CTA final por mailto a `hola@kncelados.com`. Datos centralizados en `commercial.ts` |
| | └ H13.1 Datos dinámicos en `src/lib/commercial.ts` (`platformFollowers` + `totalFollowers` por suma + `audienceFacts` + `collabConcepts` + filosofía partida en lead/accent) | hecho | — | — | Sin cifras hardcodeadas en la página; Spotify como métrica dinámica separada (escuchas ≠ seguidores) |
| | └ H13.2 Icono `Facebook.astro` nuevo | hecho | — | — | Con el 5 de plataformas (IG/TikTok/YT/FB/Spotify) completo en "Nuestros números" |
| | └ H13.3 Página respondiendo al feedback (23/09): hero sin etiqueta `[ Colabora ]`, números en una línea con Boldonse, `JUNTOS` y final de la filosofía en acento, CTA único CONTACTAR mailto | hecho | — | — | Formulario, `¿HABLAMOS?`, `HABLEMOS SIN COMPROMISO` y media kit eliminados de la página; `/api/contact` queda en el repo sin uso |
| | └ H13.4 Foto de grupo en el hero | hecho | — | — | Usuario entregó `public/foto-colabora.png` (1724×912); sustituye al collage de retratos |
| | └ H13.5 Feedback ronda 2 (23/09): hero centrado en columna única con más padding (`pt-44 pb-28` / `lg:pt-56 lg:pb-36`, `gap-16`, foto `max-w-3xl`); números de plataforma a `lg:text-6xl`; bloque total `+1,2M SEGUIDORES` en una línea y mismo tamaño (`text-4xl lg:text-6xl`, SEGUIDORES en acento) | hecho | — | — | Verificado: `astro check` 0 errores, build completo, `/contacto` 200 |

| H14 | Ajuste versión móvil de la home: carrusel de episodios (peek + snap suave) + unificación de paddings a `px-6` + revisión móvil de KncineAwards, Knsultorio y Hero | hecho | H13 | bajo | Verificación (24/09/2026): `astro check` 0 errores, `bun run build` completo, home sirve 200 con los cambios servidos por el dev server |
| | └ Carrusel `VideoSlider`: `snap-mandatory` → `snap-proximity`, padding real `pl-6 pr-6` (lg `pl-20 pr-20`) en vez del spacer-duplicado, flechas fuera del contenedor `overflow-auto`, JS buscando `prev/next` fuera del slider | hecho | — | — | Peek de la siguiente card; deslizamiento natural en móvil; flechas siguen ocultas en móvil (decisión usuario) |
| | └ Unificación alineación `px-6`: `Mug` `px-4`→`px-6`, `Header` `p-4`→`p-6` (y menú `px-4`→`px-6`) | hecho | — | — | Rejilla horizontal coherente a 24px en móvil |
| | └ Revisión móvil resto: `KncineAwarads` padding interno `px-11 sm:px-16`→`px-6 lg:px-12`; `Knsultorio` texto `text-4xl`→`text-3xl sm:text-4xl` + `px-6 pb-10`; `Hero` logo `92vw`→`85vw` + claim `text-3xl`→`text-2xl sm:text-3xl` + `gap-8`→`gap-6` | hecho | — | — | Kncine·Knsultorio·Hero no desbordan ni rozan bordes en pantallas estrechas |

> **Nota futura:** próximas iteraciones requerirán Supabase y Resend para nuevas
> secciones y páginas. Fuera de alcance del roadmap actual — queda como constancia.
> (`Resend` ya en uso parcial: env vars `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL`.)
