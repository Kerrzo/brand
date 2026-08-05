---
title: "Consistent characters across hundreds of generations"
description: "Exploring whether modern image models can create production-ready game assets instead of isolated concept art."
category: "Generative imagery"
type: "Experiment"
status: "Written up"
publishedDate: 2026-03-10
tools: ["ComfyUI", "Flux", "LoRA training", "Photoshop"]
displayOrder: 1
featured: true
relatedProjects: ["ai-game-world"]
---

Exploring whether modern image models can create production-ready game assets instead of isolated concept art. A ComfyUI graph combining reference conditioning, a trained LoRA and a strict prompt schema — the interesting part was making the failures predictable enough to fix.

## The graph, in plain terms

1. Load reference sheet → face crop
2. IP-Adapter · weight 0.62
3. Character LoRA · 1400 steps
4. Prompt schema: `[pose] [outfit] [lighting]`
5. Seed sweep 8 → pick 1, upscale ×2
6. Manual pass: hands, silhouette, palette

Nothing here is exotic. The value is in the constraints: a fixed prompt schema, a small trained model, and a human pass that only fixes the four things the model reliably gets wrong.
