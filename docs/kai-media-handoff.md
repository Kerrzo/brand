# Kai media handoff

Route: /experiments/aaa-character-with-ai/

Place files in public at these paths. Files are detected automatically. Change extension, caption and ratio in src/data/kai-media.json as needed. Missing media is labelled only in development, omitted in production. Videos reuse in-view muted looping playback.

| ID | Path | Type | Ratio |
|---|---|---|---|
| KAI_01_FINAL_PERFORMANCE | public/media/experiments/kai/final-performance.mp4 | Render supplied — silent, 1080p60 | 16/9 |
| KAI_02_INITIAL_CONCEPT | public/media/experiments/kai/initial-concept.webp | Concept artwork — supplied | 1161/1354 |
| KAI_03_AI_GENERATED_MESH | public/media/experiments/kai/ai-generated-mesh.webp | Generated mesh image — supplied | 1024/1660 |
| KAI_06_PRODUCTION_WORKFLOW | public/media/experiments/kai/production-workflow.webp | Work-in-progress montage — supplied | 1219/1603 |
| KAI_07_PIPELINE_PROGRESS | public/media/experiments/kai/pipeline-progress.webp | Boot material reference — supplied | 1448/1086 |
| KAI_09_FINAL_RESULT | public/media/experiments/kai/final-result.webp | Current viewport still — supplied; replacement planned | 1812/1687 |

Final review pending: visual quality, production readiness and efficiency. No AAA equivalence, completed performance or time savings claimed.

Section order: Hero → The question → From image to geometry → The reality check → Learning the craft → The pipeline → Bringing Kai to life → What AI actually changed → The result → The next question.

Files: src/pages/experiments/aaa-character-with-ai/index.astro; src/content/lab/aaa-character-with-ai.md; src/data/kai-media.json; src/components/content/experiments/ExperimentPendingMedia.astro; src/pages/experiments/index.astro; src/pages/experiments/[slug].astro; src/pages/styleguide/index.astro; this document.
