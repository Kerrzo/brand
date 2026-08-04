# Paul Kerr

Astro implementation of the Paul Kerr website, built from the Claude Design handoff
(`design-handoff-extracted/`) as the source of truth for layout, typography, spacing,
copy and interaction.

## Stack

- Astro (static output), TypeScript, plain CSS, minimal vanilla JS
- Astro content collections (`writing`, `work`, `projects`, `lab`) — Markdown in `src/content/`
- Self-hosted fonts via Fontsource — no runtime Google Fonts request
- `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`
- Deploys to GitHub Pages via `.github/workflows/deploy.yml`

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`       | Start local dev server                      |
| `npm run build`     | Build the static site to `./dist/`          |
| `npm run preview`   | Preview the production build locally        |
| `npm run check`     | Type-check the project (`astro check`)      |

## Structure

```
src/
  components/
    global/   Header, Footer, SEOHead, SkipLink
    ui/       Button, PlaceholderMedia, FilterBar, VideoReveal, CompareSlider, Ticker, FaqAccordion, StatsRow, FinalCTA
    home/     Homepage-only sections (hero, projects, lab, writing teaser, etc.)
    content/  ListingHero — shared hero pattern for Work/AI Lab/Writing/About
  content/    Markdown collections: writing, work, projects, lab
  layouts/    BaseLayout (site chrome), ContentLayout (generic detail-page template)
  pages/      Routes
  styles/     tokens.css, typography.css, animations.css, prose.css, global.css
```

## Font substitution

None needed. The handoff specifies Schibsted Grotesk and IBM Plex Mono, both loaded via
Google Fonts at runtime in the prototype. This build self-hosts both instead, using the
official Fontsource packages (`@fontsource-variable/schibsted-grotesk`,
`@fontsource/ibm-plex-mono`) — same typefaces, no external request.

## Scope decisions made during the build

The Claude Design export contained five pages (Homepage, Work, AI Lab, Writing, About) with
no detail-page designs — every "Read the case study" / "View project" link in the source
pointed back to a same-page placeholder anchor. Per direction from the project owner:

- **Detail pages were authored, not in the original design.** `/work/[slug]/`,
  `/ai-lab/[slug]/`, `/writing/[slug]/` and `/projects/[slug]/` use a single shared
  `ContentLayout` built from the site's existing type scale, spacing and color tokens —
  restrained, not a new design language.
- **`/writing/` article bodies are placeholders.** The handoff only supplies titles, teasers,
  categories and dates for ~13 pieces (not full copy). Each Markdown post carries
  `placeholder: true` in its frontmatter and a short stand-in body, flagged visibly on the
  article page, pending real copy.
- **`/work-with-paul/` is a new standalone route.** In the design it's only a `#contact`
  anchor/section repeated on every page. A dedicated page was added at the project owner's
  request, reusing the four service descriptions and contact details already in the design.
- **All imagery is the design's intentional striped placeholder treatment** (`PlaceholderMedia`
  component), since no real photography, screenshots or video were supplied — only 4 full-page
  reference screenshots of a different site used by the designer for inspiration, which aren't
  Paul Kerr content and were left out of `public/media/`. Drop real assets into the matching
  `public/media/<section>/` folder and pass a `src` prop to swap a placeholder for a real image.

## Interaction fidelity notes

- The homepage hero's scroll-pin/scale sequence and the header's light/dark color swap are
  ported 1:1 from the handoff's scroll math (`HomeHero.astro`).
- The original prototype's per-element JS grid-reflow hack (toggling `gridTemplateColumns`
  inline based on `innerWidth`) was replaced with plain CSS media queries per component —
  same visual result, no runtime DOM querying.
- `prefers-reduced-motion` and no-JS both fall back to the same static state: the hero's
  locked panel (heading, copy, CTAs) renders in normal document flow instead of staying
  hidden at `opacity: 0`, so the page's primary calls to action are never invisible.

## Deployment

1. Push to a GitHub repository, with Pages enabled (`Settings → Pages → Source: GitHub Actions`).
2. `public/CNAME` is already set to `kerrzo.com` — update or remove it if the domain differs.
3. `.github/workflows/deploy.yml` builds and deploys on every push to `main` (or manual dispatch).
