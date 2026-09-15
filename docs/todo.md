# Site content & polish todo

Ordered by workstream: **Shipped → Learnings → Building → Experiments → About → Homepage.**

Aligned with [`ia.md`](./ia.md). Check items off as done. Prefer finishing one section’s listing + details before moving on.

**IA backbone reminder**

- **Shipped:** Craveable · Neurotechnology · BoxOfficeVR · Amica (+ Engage+ later)
- **Building:** Kerrzo · Brilliancy
- **Experiments:** RuView · Poszo (hide character pipeline + LTX for now)
- **Learnings:** Vesper · Strategy Connect moment · Local AI

---

## 1. Shipped

### Listing — `/shipped/`

- [ ] Confirm card order and featured treatment match IA (Craveable as flagship; Neuro / BoxOffice / Amica as next backbone)
- [ ] Replace showreel `VideoReveal` placeholder with a real video (or remove until ready)
- [ ] Audit filter categories and featured “Surface” labels so they match each case
- [ ] Spot-check all five card heroes load correctly from `public/media/work/`

### Detail — `/shipped/[slug]/`

- [x] **Craveable Brands** — rich case study largely built
- [ ] **Neurotechnology** — next to build (15-min narration first, then rich page: VR, Kinect/LiDAR, clinical constraints, what worked / didn’t)
- [ ] **BoxOfficeVR** — after Neuro (narration first: VR180, Unity, streaming, theatre-in-VR product decisions)
- [ ] **International Towers / Amica** — full case study (tenant platform, access, bookings, ~8k hours saved, RN rebuild)
- [ ] **Strategy Connect** — expand beyond short stub (or decide it lives primarily as a Learning)
- [ ] **Engage+** — keep listed only after story is reconstructed; otherwise hold

### Homepage surfaces

- [ ] `AICaseStudySection` — keep Strategy Connect accurate; refresh if Learning becomes the primary home for that story
- [ ] `EnterpriseWorkSection` — Craveable + Amica cards remain evidence-grade as detail pages deepen
- [ ] `EmergingTechnologySection` — BoxOfficeVR + Neuro stay real once case studies catch up

---

## 2. Learnings

### Listing — `/learnings/`

- [x] Keep listing free of `placeholder: true` items (already filtered — protect this)
- [ ] Fix featured media label (“Hero image · replace”) when a real `src` exists
- [ ] Grow grid as new pieces publish (target IA backbone: Vesper · Strategy Connect · Local AI before filler)
- [ ] Retire or unpublish stub routes that still generate `/learnings/[slug]/` with empty heroes

### Detail — `/learnings/[slug]/`

**Published / keep polished**

- [x] **Can AI replace a drone shot?** (`can-ai-replace-a-drone-shot`) — Vesper Learning complete
- [x] **The moment software development changed** (`the-moment-software-development-changed`) — Strategy Connect Learning complete

**Next to write (IA priority)**

- [ ] **Local AI Learning** — graduate `local-ai-versus-cloud` / `local-models-versus-cloud` into a real Learning (working titles: *What I learned running AI locally* / *I wanted local AI to replace the cloud. It didn’t.*)
- [ ] Remove or rewrite remaining placeholder stubs (do not leave thin public pages):
  - [ ] `why-hardest-part-ai-products-product-judgement` (featured but placeholder — fix or unfeature)
  - [ ] `building-kerrzo-in-public`
  - [ ] `one-person-pipeline-characters-assets-worlds`
  - [ ] `keeping-a-character-consistent-400-generations`
  - [ ] `making-a-team-ai-capable`
  - [ ] `what-chess-coach-taught-me`
  - [ ] `local-models-versus-cloud` (absorb into Local AI Learning or rewrite)
  - [ ] `cto-question-nobody-asks`
  - [ ] `designing-systems-that-survive-their-own-success`
  - [ ] `twenty-five-years-of-tools-changing`
  - [ ] `concept-image-to-3d-asset`
  - [ ] `real-time-voice-ordering-latency`

**Later Learnings (from Craveable / RuView — after source work exists)**

- [ ] *The architecture made more sense once I understood the kitchen*
- [ ] *Payment success isn’t order success*
- [ ] *Software can decide when the chips get cooked*
- [ ] *Shared where possible. Different where necessary.*
- [ ] *Why we merged the marketing site and ordering site*
- [ ] RuView Learning only after the experiment concludes

### Homepage surface — `WritingSection`

- [ ] Exclude `placeholder: true` from homepage teaser (currently can surface a stub)
- [ ] Ensure teaser order prefers the IA backbone pieces

---

## 3. Building

### Listing — `/building/`

- [ ] Keep listing to **Kerrzo + Brilliancy** only (IA: Poszo stays in Experiments)
- [ ] Remove dead `pageCopy` / Poszo / `ai-game-world` listing leftovers
- [ ] Confirm card media (Kerrzo video, Brilliancy image) and copy overrides stay accurate

### Detail

- [ ] **`/building/kerrzo/`** — deepest Building page over time; replace empty hero (“Future cinematic product video”); wire real product narrative chapters (CRM → agents → analytics)
- [ ] **`/building/brilliancy/`** — replace empty hero; tighten Coach Mia / personalised coaching story
- [ ] **`/building/poszo/`** — either move fully under Experiments or keep as hidden/orphan until product decision; do not promote on Building listing
- [ ] Fix disabled “Read the Lesson” (`href="#"`) → real Learnings links or remove
- [ ] Replace related-card placeholder media with real Kerrzo / Brilliancy thumbs
- [ ] Thin `projects/*.md` content: add `heroImage` or stop relying on empty ContentLayout heroes for leftover slugs

### Homepage surface — `ProjectsSection`

- [ ] Align third card with IA (no “Game World” as Building if Poszo is Experiments)
- [ ] Keep Kerrzo + Brilliancy as the Building signal on home

---

## 4. Experiments

### Listing — `/experiments/`

- [ ] Reframe public set to IA backbone: **RuView (Wi-Fi Human Sensing)** + **Poszo / Conversational Ordering**
- [ ] **Hide** Consistent Game Character Pipeline from public listing (keep content; don’t delete)
- [ ] **Hide** LTX Video Workflow Evaluation from public listing
- [ ] Add / publish **Wi-Fi Human Sensing** (`/experiments/wifi-human-sensing/`) — status Starting; RuView · CSI · ESP32-S3
- [ ] Retitle Poszo away from generic “AI-native voice ordering” toward the working question: *Can AI reliably take a restaurant order?*
- [ ] Supply real grid `heroImage`s for every visible experiment
- [ ] Replace EXP 01 `CompareSlider` placeholders with real before/after assets (or drop until assets exist)
- [ ] Replace EXP 07 / any `VideoReveal` placeholders with real video (or remove once LTX is hidden)
- [ ] Keep the section deliberately small — finished experiments graduate out (Vesper → Learning already)

### Detail — `/experiments/[slug]/`

- [ ] **Poszo / realtime-drive-through-ordering** — expand beyond blurb; demo-ready narrative; tools, latency, escalation, reliability
- [ ] **Wi-Fi Human Sensing** — create detail page (presence, counting, false positives, ground truth)
- [ ] Expand or archive remaining lab stubs once hidden from listing:
  - [ ] `consistent-character-workflows`
  - [ ] `modular-2d-characters`
  - [ ] `concept-to-3d-asset`
  - [ ] `local-ai-versus-cloud` (graduate to Learning)
  - [ ] `modular-environment-kits`
  - [ ] `ltx-video-experiments`

### Homepage surface — `LabSection`

- [ ] Show only active public experiments (RuView + Poszo once ready)
- [ ] Add real card images (today most cards are striped placeholders)
- [ ] Stop linking “Game World” / offline experiments as if they were Building

---

## 5. About

### Page — `/about/`

- [ ] Keep editorial tone (person behind the work, not a CV)
- [ ] Replace empty **portrait** PlaceholderMedia
- [ ] Replace empty **workspace** PlaceholderMedia
- [ ] Replace empty **“Away from the screen”** lifestyle PlaceholderMedia
- [ ] Fill timeline years (or remove the year column)
- [ ] Preserve core lines: *Experience tells me what used to work. Curiosity helps me discover what works next.*
- [ ] Light pass on principles / How I Think / what I’m exploring now so they match current IA (RuView, Kerrzo, Brilliancy)

### Homepage surface — `AboutSection`

- [ ] Keep `pk.png` + short bio accurate
- [ ] Sync CTA / curiosity signal with About page once photos land

---

## 6. Homepage

### Whole page — `/`

IA flow to protect:

1. Hero / positioning — **Architecting the AI Era**
2. Current experiments
3. Building now
4. Selected shipped work
5. Latest learnings
6. About / experience signal
7. CTA — **Bring me a problem worth solving.**

### Tasks

- [ ] **Hero (`HomeHero`)** — replace “replace with screenshot” pattern with a real Kerrzo / product visual
- [ ] Confirm primary nav order stays **Experiments · Building · Shipped · Learnings · About**
- [ ] **Experiments block** — only active experiments + real media
- [ ] **Building block** — Kerrzo + Brilliancy only
- [ ] **Shipped blocks** — evidence-grade cards; deepen as case studies finish
- [ ] **Learnings block** — exclude placeholders; prefer Vesper + Strategy Connect (+ Local AI when ready)
- [ ] **About block** — real portrait; copy matches About
- [ ] **Services / Work with Paul** — keep as CTA path, not a top-nav item; language stays *Bring me a problem worth solving*
- [ ] Final CTA / footer contact paths still land correctly
- [ ] Pass for empty `PlaceholderMedia`, dead `#` links, and stale “replace” labels sitewide from the home scroll

---

## Cross-cutting hygiene

- [ ] No public listing card without a real hero image
- [ ] No homepage teaser for `placeholder: true` content
- [ ] Finished experiments leave `/experiments/` (graduate to Building, Shipped, or Learnings)
- [ ] Prefer fewer real pages over many thin stubs — IA: *substantial without filling with placeholders*
