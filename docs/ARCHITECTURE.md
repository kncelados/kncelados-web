# ARCHITECTURE.md

> Fuente de verdad del estado técnico real del proyecto. Se actualiza al cerrar cada
> hito (ver AGENTS.md). Si un dato no está aquí, no se asume — se pregunta.

## Stack — estado actual (post-upgrade H1, rama `migration`)

- Astro: 7.1.6
- Vite: 8.2.0
- Tailwind: 4.3.3 (CSS-first via `@tailwindcss/vite`)
- Hosting producción: Netlify (todavía activo)
- Adapter código: @astrojs/vercel 11.0.4
- Gestor de paquetes: bun
- Repo: `https://github.com/verdulife/kncelados-web`
- Repo destino: `https://github.com/kncelados/kncelados-web` (migración pendiente H5)

## Stack — estado destino

- Astro: 7.1.6 ✓
- Vite: 8.2.0 ✓
- Tailwind: 4.3.3 ✓
- Hosting destino: Vercel (adapter swapped, pendiente deploy + DNS + redirects)

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

## Estado del upgrade

- [x] Astro actualizado a 7.1.6 (rama `migration`, sin merge a master)
- [x] Vite actualizado a 8.2.0 (viene con Astro 7)
- [x] Tailwind v3 → v4 migrado (ya estaba v4.0.3; actualizado a 4.3.3 junto con Astro 7)
- [x] Adapter Netlify → Vercel (swap directo: `@astrojs/vercel` 11.0.4)
- [x] Scripts de scrape y mystery QR verificados tras upgrade (H3): `scrape:episodes`, `scrape:collections`, `scrape:shorts`, `mystery:qr` — ejecutan sin errores, JSON/SVG válidos, árbol restaurado a limpio
- [ ] Home rediseñada portada al proyecto actualizado
- [ ] Deploy de prueba en Vercel (preview) validado contra checklist de URLs
- [ ] Redirects/robots/sitemap replicados en `vercel.json`
- [ ] Corte de DNS realizado
