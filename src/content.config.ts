import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// heroImage/socialImage are plain root-relative paths into public/media/, not
// Astro's image() schema helper — that helper only processes files under src/,
// but our assets live in public/ so they can be dropped in without a rebuild step.

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['AI products', 'Creative AI', 'Architecture', 'Leadership']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    placeholder: z.boolean().default(false),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    heroMediaLabel: z.string().optional(),
    heroCaption: z.string().optional(),
    // Rich MDX articles compose full-bleed editorial sections themselves and
    // opt out of the narrow .prose reading column; plain Markdown pieces
    // keep the default constrained layout.
    richLayout: z.boolean().default(false),
    socialImage: z.string().optional(),
    relatedProjects: z.array(z.string()).default([]),
    relatedLab: z.array(z.string()).default([]),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    description: z.string(),
    tagline: z.string(),
    category: z.enum(['AI Strategy Platform', 'AI and intelligence', 'Enterprise platforms', 'Immersive technology', 'Health and wellbeing']),
    yearRange: z.string(),
    role: z.string().optional(),
    deliveredVia: z.string().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    featured: z.boolean().default(false),
    displayOrder: z.number().default(0),
    sourceUrl: z.string().optional(),
    sourceLabel: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedProjects: z.array(z.string()).default([]),
    relatedWriting: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    status: z.string(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    featured: z.boolean().default(false),
    displayOrder: z.number().default(0),
    tags: z.array(z.string()).default([]),
    externalUrl: z.string().optional(),
    relatedWriting: z.array(z.string()).default([]),
    relatedLab: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Generative imagery', 'Voice and real-time', '3D and assets', 'Infrastructure']),
    type: z.string(),
    status: z.enum(['Running', 'Written up', 'Paused', 'Demo ready']),
    publishedDate: z.coerce.date(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    tools: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    displayOrder: z.number().default(0),
    tags: z.array(z.string()).default([]),
    relatedProjects: z.array(z.string()).default([]),
    relatedWriting: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, work, projects, lab };
