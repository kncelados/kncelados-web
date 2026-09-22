# Auditoría web KNCELADOS — perspectiva de marca

> Documento de investigación (solo lectura). No modifica código.
> Fecha: 2026-09-22 · Repo: `C:\Users\rober\kncelados-web`
> Objetivo: evaluar `kncelados.com` como lo haría una marca que valora
> colaborar/patrocinar al podcast, y proponer prioridades.
>
> **Regla aplicada**: todos los datos provienen del código y del HTML servido.
> Nada se ha inventado. Cualquier hueco de información está marcado como
> `PENDIENTE — aportar dato` en la sección G.

---

## Fuentes inspeccionadas

- Páginas: `index`, `podcast/`, `podcast/[slug]`, `contacto`, `knsultorio`,
  `eventos`, `tienda`, `descargas`, `kncine-awards`, `link/[slug]`,
  `player/[id]`, `mystery/` e `mystery/[slug]`. No existe `404.astro` (usa la
  404 por defecto de Astro).
- Layout: `src/layouts/Layout.astro` y `src/styles/global.css`.
- Componentes y secciones: Header, Footer, Navbar (sin uso), VideoHeader,
  VideoSlider, VideoCard, VideoBackground (sin uso), Characters (sin uso),
  UnderConstruction, Link, FlipCard; Hero, Welcome, Next, Mug, Knsultorio,
  Brands, Colaborate (stub), Events (WIP), KncineAwarads (WIP).
- Datos: `src/lib/{utils,types,links,consts,mystery,metadata}.ts`,
  `src/lib/episodes/*.json` (143), `collections/*.json` (4),
  `shorts/*.json` (4).
- Config: `astro.config.mjs`, `package.json`, `docs/ARCHITECTURE.md`,
  `docs/ROADMAP.md`, `public/robots.txt`, `public/manifest.json`.
- HTML servido por el dev server en `localhost:4321` (home, descargas, mystery).

---

## Parte 1 — Los 15 puntos (mirada de marca)

### 1. Identidad y marca
Fuerte y coherente en toda la web: fondo `#03030A`, rojo knc `#e5311f`,
tipografías Boldonse (títulos) / Google Sans / Caveat, cursor custom en forma de
ceros, sprites animados estilo GIF al hover, vídeo-textura de fondo constante,
lenguaje "grupo de whatsapp" ("no es un [podcast], es 10 que pasa…", "LA P*TA
QUE GUAPA"). Hay un documento `public/brand.ai` de origen. La identidad visual
es el punto más maduro del site.

### 2. Hero
Visualmente potente: logo a `w-[min(92vw,80rem)]` con drop-shadow sobre dos
carruseles verticales de reels (bucle, con contador de views hardcodeado,
vignette). En móvil solo se muestra un carrusel al 50% de opacidad. **Pero no
dice nada de contexto**: solo logo + 2 CTAs ("Contactar" / "Ver podcast"). No
hay titular, subtítulo ni ninguna cifra agregada de audiencia.

### 3. Propuesta de valor para marcas
**Ausente.** La sección Welcome define el manifiesto de tono (excelente para
community-building) pero en ningún sitio se explica: qué es el podcast, tamaño
de audiencia, formato, cadencia, perfil de oyente ni qué puede aportar a un
patrocinador. La única cifra de "posición" es el reloj "Lunes a las 20:00 h".

### 4. Prueba social
- 13 views de clips hardcodeadas en la hero (`7,5 M`, `9,2 M`, `2,8 M`…).
- 6 redes en el menú/footer (YouTube, Spotify, Instagram, TikTok, Telegram,
  Patreon).
- **No hay** métricas agregadas (subs, oyentes, demografía), ni testimonios, ni
  logos de prensa, ni recortes. Toda la prueba social se reduce a las views del
  carrusel y los enlaces.

### 5. Sección de marcas
Marquee rojo "SERIA [IMPOSIBLE] SIN" con 5 marcas: **Goiko, Prime Video,
Penguin, Temu, Zeemo**, cada una enlazada con `rel="sponsored noopener"` y
`?from=kncelados.com` (atribución). Buen recurso, pero sin contexto: no dice qué
colaboración fue, ni en qué formato, ni resultados.

### 6. Casos de éxito
**No existen** en la web. No hay página de colaboraciones, ni ejemplos de
integraciones pasadas, ni resultados (views/impacto) de entregas patrocinadas.

### 7. Media kit
Existe `public/knc_dossier-web_2024.pdf` (1,55 MB) pero **no está enlazado en
ningún sitio** de la web, y es de 2024. No hay link en el footer, en `/contacto`
ni en la nav. Una marca no puede encontrarlo.

### 8. Arquitectura de la home
`Hero → Welcome → Next (flip clock) → Mug (taza) → Knsultorio → Brands`.
- Comentadas en `index.astro`: `Events`, `KncineAwarads`, `Colaborate`
  (`Colaborate.astro` es un stub de `<section>colaborate</section>`).
- La home es potente en tono/comunidad pero termina en la sección de marcas sin
  ningún bloque de conversión comercial.
- **Bug funcional**: el CTA del bloque Knsultorio ("Envia tu mensaje") apunta a
  `/knsultorio`, que está En construcción.

### 9. Funnel comercial
**Roto (P0).** Los dos CTAs principales de la home —"Contactar" (hero) y
"Colabora" (nav/footer, ítems duplicados en Header+Footer)— llevan a
`/contacto`, que es una página "Próximamente". De los 8 ítems de la nav, **4
apuntan a páginas En construcción**: Colabora→/contacto, Knsultorio, Eventos y
KnCine Awards. Una marca interesada no tiene por dónde entrar.

### 10. SEO técnico
Bien:
- `robots.txt` limpio (disallow `/player/`), sitemap XML indexado correcto.
- `astro.config` genera customPages para episodios y especiales y filtra
  `/player/` del sitemap.
- JSON-LD `PerformingGroup` con `sameAs` a todas las redes.
- OG/Twitter básicos en `Layout`, `lang="es"`, meta robots `index,follow`.
- `/player/` tiene noindex (en HTML servido tras doctype) + robots.txt + filtro
  de sitemap — excluido por tres vías.

**Problemas (P1/P2):**
- **La home NO tiene `<title>` ni `meta description`**: `index.astro` llama
  `<Layout>` sin props y `Layout` interpola `{title}`/`{description}`,
  resultando en `<title></title>` y `<meta name="description">` vacíos
  (confirmado en HTML servido). Es la página más importante del site.
- `og:url` en `Layout` está fijado a la home para todas las páginas (mundo
  real: se sirve vacío en el test; los Fragment `slot="head"` tipo descargas sí
  emiten propio OG/canonical tras doctype → duplicidad de og:url). **No hay
  canonical global** por página.
- No hay JSON-LD `PodcastEpisode`/`VideoObject` por episodio (143 páginas con
  datos estructurados perdidos).
- Páginas de shorts (mismas URLs `/podcast/<slug>`) **no entran en customPages** →
  no están en el sitemap.
- `manifest.json` usa `theme_color #060d14` (azul antiguo) inconsistente con el
  `#03030A` real. Meta `author` expone `verdu@live.com` (correo personal).
- No hay feed RSS del podcast.

### 11. SEO de contenidos
Base excelente: 143 episodios indexados en `src/lib/episodes/` con título, slug
limpio (`/podcast/kiss-kiss-gang-bang-knc-4x37`), descripción completa y
thumbnail oficial (`i.ytimg.com/maxresdefault`). Templados en `podcast/[slug]`.
Peros:
- La descripción se copia tal cual de YouTube → texto duplicado en la web (el
  mismo párrafo ya publicado en YT). Google puede priorizar el original y los
  CTR de la SERP dependen del snippet de YT, no de la web.
- Solo 5 de 143 episodios tienen `spotifyUrl` (la mayoría no enlaza a Spotify).
- Sin H1 fortísimo: el h1 de la home es la imagen del logo (alt="KNCELADOS");
  las fichas usan el nombre del episodio, correcto.

### 12. Rendimiento
Buen estado tras la optimización de vídeos:
- Reels 720×480 CRF30: 0,07–0,23 MB c/u; `bg_texture.mp4` 0,68 MB;
  `preload="metadata"` en reels + `load()` del siguiente clip en JS.
- Vídeos de fondo autoplay/muted/loop con `playsinline`; `prefers-reduced-motion`
  respetado (hero y JS).
- Imágenes `loading="lazy"` en VideoSlider.

**Deuda:**
- `public/v2/` es un **build antiguo completo (≈3,4 MB, con `index.html`)** que
  se sirve bajo `/v2/` (público, indexable, HTML duplicado).
- `public/intro.webm` 2,06 MB y `public/bg.mp4` 1,79 MB: `intro.webm` sí se usa
  en Welcome; `bg.mp4` solo lo referencia `VideoBackground.astro`, componente
  **sin uso** → vídeo huérfano en `public/`.
- `VideoBackground.astro` y `Characters.astro` (con sus `sprites/*.png`) no se
  importan en ningún sitio → huérfanos.
- Thumbnails de episodios consumidos en hotlink desde `i.ytimg.com` (sin cache
  propia ni `width/height`).
- Fonts de sobra: `public/fonts/clashdisplay-*.woff2` sin uso; `@fontsource-
  variable/inter` se importa por componente (VideoHeader/VideoCard) y no está en
  el Layout global — cargas duplicadas según página.
- El dev/servido confirmó home sin title/desc; el resto de páginas sirven su
  title (aunque sin sufijo consistente "| Kncelados" salvo descargas).

### 13. Responsive / móvil
Tratado en H4.2: hero limpio en móvil (1 carrusel al 50%), menú modal con
clip-path animado, sliders con `snap-x`, reloj flip ajustado. Aspectos menores a
revisar: el menú no hace focus-trap ni cierra con Esc (a11y), y hay un segundo
navbar (`Navbar.astro`) obsoleto/huérfano que no se usa.

### 14. Tienda / monetización
- `/tienda` redirige a `kncelados.myshopify.com` (vía `STORE_URL`).
- El bloque Mug enlaza directo a `myshopify.com/products/taza-roja` (hardcode).
- Existen en `public/store/` imágenes de producto (taza, totebag roja, camiseta
  azul) **sin uso en el código**. `public/taza2.webp`, `store.jpg`,
  `libro-kncelados-mystery.webp`, `cards/*.jpg` tampoco se referencian desde
  `src/` (verificar si se usan externamente antes de borrar).
- Patreon accesible vía socials y `/link/patreon`. `/link/sitges` → evento luma.
- **No hay** página de descarga de media kit ni landing comercial, repetimos.

### 15. Priorización
Resumen en la parte H. La sensación de marca: **llegas a un universe visual
brutal, pero cuando quieres concretar (precios, casos, contacto) no hay puerta.**

---

## Parte 2 — Cierre A–H

### A. Diagnóstico
La web es un portafolio de cultura de marca de altísima calidad artística y
fuerte cohesión (identidad, tono, motion). Como **página de comunidad** cumple.
Como **página comercial (funnel de sponsors)** está vacía: no dice qué es, no
muestra cifras agregadas, no tiene casos, no tiene canal de contacto funcional y
esconde su propio dossier.

### B. Problemas
- **P0**
  1. CTA "Contactar"/"Colabora" → `/contacto` = "Próximamente".
  2. Home sin `<title>` ni `meta description` (SEO + SERP).
  3. Media kit (`knc_dossier-web_2024.pdf`) no enlazado desde la web.
  4. CTA Knsultorio en home → página En construcción.
- **P1**
  5. Sin casos de éxito ni métricas agregadas (subs/oyentes/demografía).
  6. Sección Brands sin contexto (qué colaboraciones, con qué resultado).
  7. Sin canonical global por página; `og:url` fijo a la home.
  8. `public/v2/` build antiguo servido en producción.
  9. 4 ítems de la nav apuntan a páginas En construcción.
- **P2**
  10. Componentes/fonts/vídeos huérfanos: Navbar, VideoBackground (+`bg.mp4`),
      Characters (+`sprites/`), clashdisplay, `metadata.ts` (vacío y sin uso).
  11. solo 5/143 episodios con enlace a Spotify.
  12. Thumbnails en hotlink sin dimensión; `manifest.json` color antiguo.
- **P3**
  13. JSON-LD de episodio ausente; shorts fuera del sitemap; sin RSS.
  14. Sin 404 personalizada; sin focus-trap/Esc en menú; a11y menor.

### C. Oportunidades
- Convertir `/contacto` en una **landing comercial real**: qué es Kncelados,
  cifras clave, marcas que ya confían, formulario/email y descarga del dossier.
- Añadir un **bloque de métricas** (totales "grandes" verificables) y **2-3
  casos de éxito** (marca + formato + resultado medible).
- Enriquecer la sección Brands con contexto (cada marca = una colaboración
  descrita).
- Servir el PDF del dossier desde `/media-kit` o enlazarlo en el footer.
- Aprovechar el sitemap/rebuild: RSS + JSON-LD `PodcastEpisode` son fáciles con
  la data ya existente.
- Sanear `public/` (borrar `v2/`, huérfanos) → menos superficie de crawl y
  menos peso de build.

### D. Arquitectura recomendada
```
Home (mantener identidad):
  Hero          → con 1 línea de contexto + CTA real
  Welcome       → manifiesto (mantener)
  Next          → "Lunes 20:00" (mantener)
  Mug           → tienda (mantener)
  Knsultorio    → cuando la página exista (ocultar CTA o terminarla)
  BrandMarquee  → ampliada con casos cortos
  Colabora      → CTA final → /contacto (landing real)

Páginas:
  /contacto     → landing comercial (no "Próximamente")
  /media-kit    → dossier o enlace al PDF
  /podcast/*    → mantener; añadir JSON-LD + spotifyUrl al resto
```
Oculta o termina Eventos / KnCine Awards / Colaborate según roadmap.

### E. SEO recomendado (orden)
1. Home con `title` + `description` con las cifras reales (según G: datos a
   aportar). Desbloquea la SERP de marca.
2. Canonical dinámico por página (`og:url` también) — Astro usa `Astro.url`.
3. JSON-LD `PodcastEpisode` + `VideoObject` en `podcast/[slug]` desde los JSON.
   Añadir shorts a `customPages`.
4. RSS del podcast (los 143 items ya están en `src/lib`).
5. Sufijo de título consistente ("…| Kncelados") y `og:image` con más densidad
   (hoy `logo-512.png`).
6. Cuadro de `width/height` en los thumbnails para evitar CLS.

### F. Rendimiento recomendado
- Borrar `public/v2/` (build viejo).
- Borrar/decidir el destino de `bg.mp4`, `intro.webm` (2 MB en autoplay con
  `opacity-20` — evaluar si compensa frente a un poster/frame), fonts clashdisplay,
  sprites y componentes huérfanos.
- Servir thumbnails vía cache propio o al menos `loading="lazy"` + dimensiones
  (la [recomendación VAST de imagen](https://web.dev/learn/performance) la
  cumple con async decode).
- Mover `@fontsource-variable/inter` al Layout (una sola carga) si se va a
  seguir usando por componente.

### G. Datos a conseguir (placeholders — nada de inventar)
- [ ] Métricas agregadas por plataforma: subs YouTube, oyentes/streams Spotify,
      seguidores IG/TikTok, descargas por programa.
- [ ] Demografía del público (edad, región, intereses) — para el pitch de marca.
- [ ] Resultados verificables de 2-3 colaboraciones pasadas (con las 5 marcas).
- [ ] Enlace/PDF del media kit actualizado (2026).
- [ ] Email comercial de contacto o formulario real de briefing.
- [ ] Confirmar qué hace `/link/sitges` y si hay más KPI de eventos.

### H. Plan por fases
- **P0 — Funcionar como negocio (bloqueante para marcas)**
  1. Landing `/contacto` con propuesta + datos clave + formulario/dossier.
  2. `title`/`description` en la home.
  3. Enlazar el PDF actualizado desde footer/contacto.
- **P1 — Creíble**
  4. Bloque de métricas + 2-3 casos en home.
  5. Contexto en la sección Brands.
  6. Canonical/og:url por página.
  7. Borrar `public/v2/`.
  8. Decidir Eventos/Knsultorio/Kncine (terminar u ocultar del menú).
- **P2 — Pulido**
  9. Limpieza de huérfanos (componentes, fonts, vídeos).
  10. spotifyUrl masivo (backfill script ya existe: `scrape/spotifyBackfill.js`).
  11. Manifest/documentation mínima.
- **P3 — SEO avanzado**
  12. JSON-LD por episodio, shorts en sitemap, RSS, 404 custom, a11y menú.

---

## Conclusión final

> **Si yo fuera una marca y entrara hoy en kncelados.com**: el impacto visual es
> de otro nivel y el universo "grupo de whatsapp" con marcas referentes (Goiko,
> Prime Video, Penguin, Temu, Zeemo) genera confianza inicial. Pero cuando
> quiero dar el paso —quién sois con números, qué habéis hecho, cómo os
> contacto, dónde está vuestro dossier— **me encuentro una puerta cerrada
> ("Próximamente")** y cero pruebas de alcance agregado. Faltaría: una propuesta
> comercial explícita, métricas verificables, dos o tres casos de éxito y un
> canal de contacto funcional. Hoy la web es excelente como comunidad e
> invisible como partner.