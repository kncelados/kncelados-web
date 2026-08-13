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
| H6 | Deploy a Vercel + verificación manual | pendiente | H5 | medio | Deploy funciona desde nuevo repo, todas las páginas responden 200, usuario verifica visualmente |
| H7 | Corte DNS en IONOS (Netlify se mantiene como respaldo hasta confirmar) | pendiente | H6 | **alto** | `www.kncelados.com` sirve desde Vercel; tras confirmar, usuario borra Netlify manualmente |

> **Nota futura:** próximas iteraciones requerirán Supabase y Resend para nuevas
> secciones y páginas. Fuera de alcance del roadmap actual — queda como constancia.
