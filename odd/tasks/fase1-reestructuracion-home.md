# FASE 1 — Reestructuración global de la home (14 secciones)

- **Feature**: `fase1-reestructuracion-home`
- **Rama**: `rup-edits` (local; push deshabilitado, lo sube el compañero)
- **Último commit base**: `0596cd6` (H11)
- **Objetivo**: Reordenar `src/pages/index.astro` al orden estricto de 14 secciones aprobado por el usuario y aplicar el nuevo copy/diseño ya confirmado.

## Orden final de la home (aprobado)

1. Hero (claim nuevo + logo + botones)
2. Próximo episodio (Next — fondo rojo `bg-knc-600`, texto `text-dark-950`)
3. Sobre nosotros (Welcome + botonera 4 plataformas, sin métricas)
4. Episodios recientes (Latest — título renombrado + fix line-height Boldonse)
5. Marcas / Colaboraciones (Collaborations — SIN métricas)
6. Imposible sin (Brands)
7. El Consultorio (Knsultorio — añadir a home)
8. La Taza (Mug)
9. MYSTERY (nuevo — solo heading `MYSTERY`, diseño pendiente)
10. KN Cine Awards (KncineAwarads — añadir, bloque WIP)
11. Estadísticas (nuevo — solo heading `ESTADÍSTICAS`, SIN grid de métricas)
12. Mete tu marca en la conversación (bloque comercial)
13. Hablamos (FinalCta → /contacto)
14. Footer

## Decisiones de copy confirmadas (tool question, 2026-09-23)

- **Hero claim**: `Tu dosis semanal de humor para un mundo que no da tregua` (exacto; reemplaza a "El podcast de humor [sin] filtros").
- **Hero micro-contexto**: RETIRAR "Cada lunes a las 20:00 h, o un día antes en nuestro canal de YouTube." (lo asume §2).
- **Next copy**: `Si sobrevives al lunes, nos vemos a las ocho` (exacto).
- **Latest título**: "Episodios recientes".
- **Interlineado Boldonse**: revisar `line-height` de títulos (quedan superpuestos) — fix real, no copy.
- **Sección 5 Marcas/Colaboraciones**: "no toque eso" → NO crear logos/sinergias/casos; mantener bloque comercial existente; solo retirar el grid de métricas.
- **Sección 9 MYSTERY**: solo título `MYSTERY`; diseño posterior.
- **Sección 13 Hablamos**: botón a `/contacto` (la home NO incrusta formulario).
- **Estadísticas (11)**: solo heading `ESTADÍSTICAS`; SIN grid de métricas (las 10 cifras salen de home; datos permanecen en `src/lib/commercial.ts` para MediaKit/contacto).
- **Menú**: mantener opciones actuales (Inicio, Podcast, Colabora, Tienda, Descargas).
- **Tienda**: link directo a `STORE_URL` con `target="_blank" rel="noopener"` (Header y Footer).

## Checklist de tareas

- [x] T-1 Reordenar `src/pages/index.astro` (añadir Knsultorio, KncineAwarads, Mystery, Stats; quitar `<Cases/>`; retirar grid métricas de Collaborations)
- [x] T-2 `Hero.astro`: claim nuevo, retirar micro-contexto, cuerpo font-sans
- [x] T-3 `Next.astro`: `bg-knc-600`, textos `text-dark-950`, copy nuevo; mantener flip clock + CTA "Ver podcast"
- [x] T-4 `Welcome.astro`: añadir botonera YouTube/Spotify/Instagram/TikTok (mismos hrefs que Header); sin métricas
- [x] T-5 `Latest.astro`: título "Episodios recientes"
- [x] T-6 `global.css`: ajustar `line-height` en títulos Boldonse (`leading-normal` en h1–h6; Knsultorio/Mug sin `leading-tight/snug`)
- [x] T-7 `Collaborations.astro`: quitar grid de `metrics`
- [x] T-8 Crear `src/sections/Stats.astro` (heading `ESTADÍSTICAS` solo)
- [x] T-9 Crear `src/sections/Mystery.astro` (heading `MYSTERY` solo)
- [x] T-10 `Header.astro` / `Footer.astro`: tienda → `STORE_URL` directo `target="_blank" rel="noopener"`
- [x] T-11 Crear `src/sections/MeteTuMarca.astro` (heading + copy con "marcas" en `text-knc-600` + botón "Hablemos" → `/contacto`)

## Checklist de tareas (FASEs 2-6 — deltas sobre FASE 1)

Elegido por tool question 2026-09-23: claim `text-xl/lg:text-2xl`, botones solo más padding (`px-12 py-4`), botonera Welcome = texto + icono de red.

- [x] T-2a `Header.astro`: mantener `drop-shadow` del logo solo con menú cerrado — clase CSS propia `.header-logo` con `filter: drop-shadow(...)` + `transition`; `.no-shadow` se togglea en `open()`/`close()`
- [x] T-2b `Hero.astro`: claim → `text-xl lg:text-2xl`
- [x] T-2c `Hero.astro`: botones Contactar / Ver podcast → `px-12 py-4`
- [x] T-4a `Welcome.astro`: texto largo → titular `Cuatro amigos, un podcast, cero filtros` (con "cero filtros" en `text-knc-600`)
- [x] T-4b `Welcome.astro`: `<Link>` con `icon={Youtube|Spotify|Instagram|Tiktok}` (imports desde `@/lib/assets/*`)
- [x] T-5c `VideoSlider.astro`: quitar spacer final `div.snap-end` + `scroll-p-*` → `scroll-pl-*`; flechas `scrollBy` de 1 tarjeta con tope `maxScroll`/`0`
- [x] T-6a `MeteTuMarca.astro`: "MARCA" del h2 envuelta en `<span class="text-knc-600">`
- [x] T-5d FIX `Latest.astro`: `slice(0, 5)` → `slice(0, 15)` (con solo 5 cards no había desbordamiento en pantallas anchas y el slider no deslizaba; el spacer final quitado era "sala de scroll" artificial = el "hueco" reportado). 15 cards ≈ 5800px desbordan en 4K y casi toda ultrawide. Decisión: tool question → "15 más recientes".

## Verificación

- `bun run build` → `astro check` 0 errores / 0 warnings / 0 hints; build vercel completo (2026-09-23 12:56).
- HTML servido en `http://localhost:4322` (HTTP 200) contiene: "Cuatro amigos", "cero filtros", `scroll-pl-6`, "METE TU <span", `px-12 py-4`, `text-xl leading-relaxed`, `lg:text-2xl`. `snap-end` ya NO existe en markup (solo queda la utilidad CSS de Tailwind).
- Revisión visual pendiente del usuario en `http://localhost:4322`.

## Estado

- **Commits**: NINGUNO hasta que el usuario lo pida explícitamente (cambios Fase 1+3 previos siguen sin commitear en `rup-edits`).
- **Evidencia**: build ✓, assess medium/under_budget ✓, checklist completado (T-1…T-11).