# Add IMDb links to KnCine Awards posters

## Goal

Make every current KnCine Awards poster open its official IMDb search result in a new tab.

## Tasks

- [x] Add the shared IMDb search URL builder and anchor markup.
- [x] Update the living project documents.
- [x] Run Astro checks, build, and diff validation.

## Constraints

- Use the user-approved official IMDb search URL pattern: `https://www.imdb.com/find/?q=<encoded title>`.
- Do not invent IMDb title identifiers.
- Preserve existing poster layout and carousel behavior.

## Acceptance Criteria

- All nine current movie posters are IMDb links.
- Links open in a new tab with safe external-link attributes.
- Existing movie data and pagination remain intact.
- Astro check, production build, and diff check pass.

## Verification

- `bunx astro check`, `bun run build`, and `git diff --check` passed.

## Engram Mirror

- Intended topic: `odd/add-kncine-imdb-links/tasks`
- Persistence unavailable: the installed Engram binary does not support `instance-id`.
