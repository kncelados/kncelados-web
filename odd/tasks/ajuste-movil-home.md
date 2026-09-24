# Ajuste versión móvil home (carrusel + alineación)

Estado: hecho
Hito: Ajuste versión móvil de la home tras rediseño (H14)

## Objetivo

Corregir la versión móvil de la home: el carrusel de episodios debe deslizar bien,
y la alineación/espaciado debe quedar "cuadrada" y coherente entre secciones.

## Decisiones del usuario (confirmadas)

1. **Carrusel de episodios**: mostrar peek de la siguiente card (pista visual de
   que hay más) con deslizamiento suave. No usar "una card por pantalla".
2. **Alineación**: unificar paddings móviles a `px-6` (24px) en todas las secciones
   y en el header.
3. **Alcance**: revisar todo el móvil (hero, Knsultorio, KncineAwards, footer, etc.).

## Problemas detectados

### Carrusel de episodios (`src/components/VideoSlider.astro`)

- Flechas `prev`/`next` ocultas en móvil (`hidden lg:inline`) → solo swipe.
- `snap-mandatory` produce encaje rígido que se siente mal al deslizar con cards
  casi a pantalla completa.
- El primer elemento es un spacer de 24px que además es punto de snap → desplaza
  el encaje del primer episodio.
- Contenedor con altura fija `h-44` (176px) y cards `w-72` (~162px de alto) quedan
  sin centrar verticalmente del todo.

### Alineación / paddings

- `Mug.astro` usa `px-4` (16px) mientras el resto usa `px-6` (24px).
- `Header.astro` usa `p-4` (16px).
- `KncineAwarads.astro` usa `px-11` / `px-16` internos y `scroll-pl-8`, distinto
  al padding padre.

## Plan de corrección

1. **VideoSlider**: dejar de usar `snap-mandatory` (pasar a `snap-proximity` o
   quitar forzado), centrar cards verticalmente en el contenedor, mantener la
   primera card con padding correcto y mostrar un "peek" de la siguiente (bajar
   ancho de card en móvil o usar scroll-padding para dejar visible parte de la
   siguiente). Valorar mostrar flechas en móvil.
2. **Unificar paddings**: `Mug` `px-4` → `px-6`; `Header` `p-4` → `p-6`.
3. **Revisar** Knsultorio, KncineAwards, Footer, Hero en móvil y alinear con la
   retícula px-6.

## Verificación

- `bun run build` + `astro check` sin errores.
- Revisión visual en móvil por el usuario.