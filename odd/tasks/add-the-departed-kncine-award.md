# Add The Departed to KnCine Awards

## Goal

Add the user-provided poster for *Infiltrados* (*The Departed*) to the KnCine Awards carousel on the home page.

## Scope

- Use the existing `public/infiltrados.png` asset.
- Add one entry to the centralized KnCine Awards movie data.
- Update the living project documents with the completed small milestone.
- Verify and deliver one work-unit commit to `origin`.

## Tasks

- [x] Add *Infiltrados* to `src/lib/kncine.ts` using the provided poster.
- [x] Update `docs/ROADMAP.md` and `docs/ARCHITECTURE.md` with the completed milestone.
- [ ] Run focused verification, commit the work unit, and push the feature branch.

## Acceptance Criteria

- The KnCine Awards carousel renders `Infiltrados` with `public/infiltrados.png`.
- The entry uses the existing `KncineEntry` shape and the carousel continues to paginate correctly.
- Astro checks and the production build pass.
- The work-unit commit is pushed to `origin/feat/add-the-departed-kncine-award`.

## Delivery Evidence

- Commit: pending
- Verification: `bunx astro check` and `bun run build` passed; `git diff --check` passed.

## Engram Mirror

- Intended topic: `odd/add-the-departed-kncine-award/tasks`
- Persistence: unavailable in this session because the installed Engram binary does not support `instance-id` (requires v2.0.0-rc.11+).
