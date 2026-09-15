# Kerrzo editorial v1

## Media update — 15 September 2026

The detail page now uses the user-supplied marketing UI collection in `public/media/projects/kerrzo/marketing/`. All 28 PNGs, `index.json` and `README.md` were moved from incoming and verified by SHA-256 before the empty incoming directory was removed.

Current selections: sales pipeline (hero), project portfolio (first product figure), agent workspace (second product figure). These are marketing UI mockups, as identified by the supplied manifest, and captions reflect that provenance. Original dimensions are preserved. The homepage and Building listing continue using the original animation; the animation and its extracted stills remain in the media library.

The original v1 notes below describe the previous detail-page media selection.


The page at `/building/kerrzo/` uses the existing project collection entry and shared article sections, labels, scroll statement, learnings list, navigation rows and Keep Exploring. BuildingHero and BuildingEvidence are reusable for future Building detail pages. Layout-specific styles live in `src/styles/building-editorial.css`.

## Evidence sources

Only `public/media/projects/kerrzo.mp4` was found as Kerrzo product evidence. It is the existing homepage/listing animation, 1920 × 1080, 8.7 seconds long. It shows resource planning, a booking interaction and an assistant capacity alert; it does not demonstrate every planned module or prove backend agent functionality.

The page reuses that video with user-controlled playback. Three unaltered WebP frames were extracted with ffmpeg:

- `public/media/projects/kerrzo/planning.webp`: 8.4 seconds; hero poster.
- `public/media/projects/kerrzo/booking.webp`: 4.5 seconds; first product evidence figure.
- `public/media/projects/kerrzo/assistant.webp`: 7.2 seconds; second product evidence figure.

The dates shown in the original animation are in November 2025. Captions identify it as early evidence, not current screenshots. No image enhancement, invented interface or generated product UI was used.

## Replace next

Replace the product evidence array in the page with current full-resolution captures. Prefer a broad sales/pipeline or customer workspace capture and a contrasting AI/knowledge/support view. Replace the hero poster/video when updated evidence is available. No empty screenshot placeholders are rendered: the existing animation supplies the initial composition.

No Kerrzo product URL or separate logo was found in the project metadata or site source. The page renders an external link only when `externalUrl` is supplied in the project entry; email and social profile URLs were not treated as product URLs.

## Copy decisions

The supplied brief is the source for active status, the 2026–now period, the primary commercial bet and the technology stack. Module completion was not inferred. Assistant and agent workflows are described as development direction. The resource-planning animation is the only demonstrated interface. The diagrams communicate product direction and architecture principles, not a verified deployment topology.

The hero and opening question form one light introduction, separated by a rule. The black editorial transition is followed by alternating context, product, agents, architecture, workflow and commercial-test chapters. Building in public and Keep Exploring share the closing light area before the existing black footer.
