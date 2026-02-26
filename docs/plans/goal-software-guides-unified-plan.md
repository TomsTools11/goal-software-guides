# GOAL Software Guides — Unified Design & Build Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a GOAL-branded Next.js website with interactive beginner guides for Notion and Claude Cowork, backed by a formalized design token system and designed so adding future guides requires only a registry entry + MDX file.

**Architecture:** Next.js App Router with a single dynamic `[slug]` route rendering all guides. MDX content files with embedded React interactive components (Accordion, StepByStep, AnimatedDemo). Framer Motion for animations. Sidebar TOC with scroll-spy and progress tracking via localStorage. Guide registry pattern (`src/lib/guides.ts`) is the extensibility cornerstone. A `.ui-design/` directory provides structured design tokens as the single source of truth for all styling.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS, TypeScript, MDX, Framer Motion, rehype-slug, remark-gfm

---

## Context

GOAL (an insurance SaaS company) needs a website to house beginner-level software guides for their team. The project root contains brand assets (3 logos, full style guide with CSS tokens) and content files (2 Notion guides, 1 Claude Cowork guide in Markdown). No web project exists yet — this is from scratch. Must match or exceed the interactivity of the reference site (goal-notion-guide.manus.space), which is a React SPA with animated walkthroughs, interactive demos, and progress tracking.

**Source Content Files:**
- `Goal Style Guide Brand + Layout Overview.md` — CSS tokens, typography, spacing, component patterns
- `Mastering Notion: A Comprehensive Guide to Professional Workspace Architecture copy.md` — 8-chapter Notion guide
- `Notion New User Presentation Guide copy.md` — 10-section onboarding outline (merge into Notion guide)
- `cowork_guide_content.md` — Claude Cowork guide content

**Brand Assets:** `goal_blk.png`, `goal_wht.png`, `gicon.png` (all in project root)

---

## Design System Specification

### Color Decisions

The style guide lists `#006CFF` as a placeholder. The finalized primary brand color is **`#0D77DD`** (GOAL blue). Full 50–950 palettes will be generated for primary and accent via HSL interpolation.

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0D77DD` | CTAs, links, highlights, progress indicators |
| Primary Dark | `#0050BF` | Hover states, focus outlines |
| Accent | `#933974` | Secondary accents, badges, icons |
| Background | `#FFFFFF` | Page background |
| Background Soft | `#F5F5F7` | Section backgrounds, hero form areas |
| Surface | `#FFFFFF` | Cards (with shadow/border) |
| Text | `#1A1A1A` | Body copy |
| Text Muted | `#666666` | Disclaimers, secondary text |
| Text Inverse | `#FFFFFF` | Text on dark backgrounds |
| Border | `#E2E2E8` | Card/section borders |
| Success | `#16A34A` | Check icons, positive states |
| Warning | `#F59E0B` | Budget alerts, compliance notices |
| Error | `#DC2626` | Form validation errors |

### Typography
- **Font Family:** `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Mono:** `ui-monospace, "Fira Code", monospace`
- **Scale:** xs (0.75rem), sm (0.875rem), base (1rem), lg (1.125rem), xl (1.25rem), 2xl (1.5rem), 3xl (1.875rem), 4xl (2.25rem), 5xl (3rem)
- **Weights:** normal 400, medium 500, semibold 600, bold 700

### Spacing (linear 4/8px scale)
4, 8, 12, 16, 24, 32, 40, 48, 64 px

### Border Radius
sm (4px), base (6px), md (8px), lg (12px), xl (16px), 2xl (24px), full/pill (9999px)

### Shadows
sm, base, md, lg, xl (standard elevation scale)

### Breakpoints
sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

### Layout Constraints
- Max container width: `1120px`
- 12-column grid
- Pill-style buttons (`border-radius: 999px`)

---

## File Tree (Target)

```
goal-software-guides/
  .ui-design/
    setup_state.json              -- Design system configuration state
    design-system.json            -- Master token configuration
    tokens/
      tokens.css                  -- CSS Custom Properties (:root)
      tailwind.config.js          -- Tailwind theme extension module
      tokens.ts                   -- TypeScript module (as const + types)
      tokens.json                 -- DTCG format JSON
  public/
    images/
      goal_blk.png
      goal_wht.png
      gicon.png
      guides/
        notion-icon.svg
        claude-icon.svg
    favicon.ico
  src/
    app/
      layout.tsx                  -- Root layout (Header + Footer + Inter font)
      page.tsx                    -- Landing page
      globals.css                 -- Tailwind directives + base styles
      guides/
        [slug]/
          page.tsx                -- Dynamic guide route
    components/
      layout/
        Header.tsx
        Footer.tsx
        Container.tsx
      ui/
        Button.tsx
        Card.tsx
        Badge.tsx
        ProgressBar.tsx
      guide/
        GuideLayout.tsx
        GuideSidebar.tsx
        TableOfContents.tsx
        ScrollProgress.tsx
      interactive/
        Accordion.tsx
        StepByStep.tsx
        InfoCard.tsx
        TipCallout.tsx
        AnimatedDemo.tsx
        ChecklistItem.tsx
      mdx/
        MDXComponents.tsx
    content/
      notion/
        index.mdx
      claude-cowork/
        index.mdx
    hooks/
      useProgressTracker.ts
      useScrollSpy.ts
      useHeadings.ts
    lib/
      guides.ts                   -- Guide registry (THE extensibility point)
  tailwind.config.ts
  next.config.mjs
  package.json
  tsconfig.json
  docs/
    plans/
```

---

## Task 1: Initialize Next.js Project

**Files:** Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Step 1: Scaffold the project**
```bash
cd /Users/tpanos/TProjects/current-projects/goal-software-guides
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

**Step 2: Install dependencies**
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react framer-motion
npm install -D @types/mdx rehype-slug rehype-autolink-headings remark-gfm
```

**Step 3: Move brand assets to public/**
```bash
mkdir -p public/images/guides
cp goal_blk.png goal_wht.png gicon.png public/images/
```

**Step 4: Commit**
```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with dependencies and brand assets"
```

---

## Task 2: Set Up Design Token System

**Files:**
- Create: `.ui-design/setup_state.json`
- Create: `.ui-design/design-system.json`
- Create: `.ui-design/tokens/tokens.css`
- Create: `.ui-design/tokens/tailwind.config.js`
- Create: `.ui-design/tokens/tokens.ts`
- Create: `.ui-design/tokens/tokens.json`

**Step 1: Create `.ui-design/setup_state.json`**

State tracking file with all configuration choices (preset: standard, primary: `#0D77DD`, accent: `#933974`, light mode only, Inter font, 4/8px spacing, rounded 12px base).

**Step 2: Create `.ui-design/design-system.json`**

Master configuration file containing all token values, metadata, and system settings.

**Step 3: Create `.ui-design/tokens/tokens.css`**

CSS Custom Properties under `:root` with all token categories (colors with full 50–950 palettes, typography, spacing, radii, shadows, breakpoints). Light mode only.

**Step 4: Create `.ui-design/tokens/tailwind.config.js`**

Tailwind theme extension module exporting colors, fontFamily, spacing, borderRadius, boxShadow, screens — sourced from the token values.

**Step 5: Create `.ui-design/tokens/tokens.ts`**

TypeScript module with `as const` token objects and exported types (`ColorToken`, `SpacingToken`, etc.).

**Step 6: Create `.ui-design/tokens/tokens.json`**

Design Token Community Group (DTCG) format JSON with all token values.

**Step 7: Verify**
- All 6 files created in `.ui-design/`
- CSS file parses correctly
- Tailwind config exports a valid JS module
- TypeScript file has proper `as const` assertions and type exports
- JSON follows DTCG structure
- Color palettes are visually coherent (50 = lightest, 950 = darkest)

**Step 8: Commit**
```bash
git add .ui-design/
git commit -m "feat: add GOAL design token system (CSS, Tailwind, TS, JSON)"
```

---

## Task 3: Configure Tailwind + MDX with GOAL Brand Tokens

**Files:**
- Modify: `tailwind.config.ts` (consume from `.ui-design/tokens/tailwind.config.js`)
- Modify: `next.config.mjs`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Configure Tailwind with design tokens**

Import the generated token module from `.ui-design/tokens/tailwind.config.js` into `tailwind.config.ts` and spread/merge the theme extension. This ensures the Tailwind config stays in sync with the token source of truth.

```ts
import type { Config } from 'tailwindcss';
import designTokens from './.ui-design/tokens/tailwind.config';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}', './src/content/**/*.mdx'],
  theme: {
    extend: {
      ...designTokens,
      maxWidth: { container: '1120px' },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Configure MDX support in next.config.mjs**
```js
import createMDXPlugin from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const withMDX = createMDXPlugin({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
});
```

**Step 3: Set up global styles and Inter font in layout.tsx**

`src/app/globals.css` — import token CSS custom properties, add Tailwind directives and base styles:
```css
@import '../../.ui-design/tokens/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply font-sans text-text bg-background; }
}
```

`src/app/layout.tsx` — Import Inter from `next/font/google`, set metadata with title "GOAL Software Guides", use `gicon.png` as favicon.

**Step 4: Verify the dev server starts**

Run: `npm run dev`
Expected: App loads at localhost:3000 with Inter font and white background

**Step 5: Commit**
```bash
git add tailwind.config.ts next.config.mjs src/app/globals.css src/app/layout.tsx
git commit -m "feat: configure Tailwind from design tokens and MDX support"
```

---

## Task 4: Build Layout Components (Header, Footer, Container)

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/Container.tsx`
- Modify: `src/app/layout.tsx` (add Header/Footer)

**Step 1: Build Container component**

`src/components/layout/Container.tsx` — simple `max-w-container mx-auto px-4` wrapper.

**Step 2: Build Header component**

`src/components/layout/Header.tsx`:
- Sticky top nav with `bg-white/80 backdrop-blur` on scroll
- Left: GOAL logo (`goal_blk.png`) linking to `/`
- Right: "Guides" nav link
- Mobile: Hamburger menu with Framer Motion slide-in

**Step 3: Build Footer component**

`src/components/layout/Footer.tsx`:
- `bg-background-soft`, copyright "© 2026 Goal Platform, LLC."
- Links: Terms, Privacy

**Step 4: Add Header/Footer to root layout**

Modify `src/app/layout.tsx` to render `<Header />` and `<Footer />` wrapping `{children}`.

**Step 5: Verify visually**

Run: `npm run dev`
Expected: Header with GOAL logo and footer visible on all pages

**Step 6: Commit**
```bash
git add src/components/layout/ src/app/layout.tsx
git commit -m "feat: add Header, Footer, and Container layout components"
```

---

## Task 5: Build UI Components (Button, Card, Badge, ProgressBar)

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/ProgressBar.tsx`

**Step 1: Build Button component**

Two variants: `primary` (solid blue pill) and `secondary` (outlined blue pill). Style guide specs:
- `padding: 0.75rem 1.5rem`, `border-radius: 999px`, `font-weight: 600`, `font-size: 15px`
- Primary: `bg-primary text-text-inverse`, hover: `bg-primary-dark`
- Secondary: `bg-transparent text-primary border-primary`, hover: subtle bg

**Step 2: Build Card component**

`bg-surface rounded-xl border border-border shadow-sm p-6` with `interactive` variant that adds Framer Motion hover scale/shadow.

**Step 3: Build Badge component**

Small pill for "Beginner", "8 Chapters", etc. Props: `variant: 'default' | 'primary' | 'accent'`.

**Step 4: Build ProgressBar component**

Linear progress bar. Props: `value: number` (0-100). Uses `bg-primary` for the fill.

**Step 5: Commit**
```bash
git add src/components/ui/
git commit -m "feat: add Button, Card, Badge, and ProgressBar UI components"
```

---

## Task 6: Build Guide Registry and Landing Page

**Files:**
- Create: `src/lib/guides.ts`
- Modify: `src/app/page.tsx`
- Create: `public/images/guides/notion-icon.svg`
- Create: `public/images/guides/claude-icon.svg`

**Step 1: Create guide registry**

`src/lib/guides.ts`:

```ts
export interface GuideMetadata {
  slug: string;
  title: string;
  description: string;
  icon: string;
  chapters: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export const guides: GuideMetadata[] = [
  {
    slug: 'notion',
    title: 'Mastering Notion',
    description: 'Learn workspace architecture, databases, views, automations, and integrations.',
    icon: '/images/guides/notion-icon.svg',
    chapters: 8,
    estimatedTime: '30 min',
    difficulty: 'Beginner',
    tags: ['Productivity', 'Workspace', 'Databases'],
  },
  {
    slug: 'claude-cowork',
    title: 'Getting Started with Claude Cowork',
    description: 'Set up Claude Cowork and learn real-world use cases for multi-step task automation.',
    icon: '/images/guides/claude-icon.svg',
    chapters: 6,
    estimatedTime: '20 min',
    difficulty: 'Beginner',
    tags: ['AI', 'Automation', 'Productivity'],
  },
];
```

**To add a future guide:** Add one object to this array + create `src/content/{slug}/index.mdx`. Done.

**Step 2: Create simple SVG guide icons**

Simple branded icons for each guide card.

**Step 3: Build landing page**

`src/app/page.tsx`:
- Hero: Eyebrow "GOAL SOFTWARE GUIDES" + H1 "Learn the tools that power your workflow" + subtitle
- Framer Motion fade-in/slide-up on mount
- 2-column grid of guide cards (from `guides` registry), each linking to `/guides/[slug]`
- Cards show: icon, title, description, difficulty badge, chapters, estimated time, "Start Guide" button
- Staggered entrance animation

**Step 4: Verify landing page**

Run: `npm run dev`
Expected: Landing page with hero and two guide cards. Clicking a card navigates to `/guides/notion` (404 for now).

**Step 5: Commit**
```bash
git add src/lib/guides.ts src/app/page.tsx public/images/guides/
git commit -m "feat: add guide registry and landing page with guide cards"
```

---

## Task 7: Build Guide Layout Template (Sidebar + Content Area)

**Files:**
- Create: `src/app/guides/[slug]/page.tsx`
- Create: `src/components/guide/GuideLayout.tsx`
- Create: `src/components/guide/GuideSidebar.tsx`
- Create: `src/components/guide/ScrollProgress.tsx`
- Create: `src/hooks/useScrollSpy.ts`
- Create: `src/hooks/useHeadings.ts`
- Create: `src/hooks/useProgressTracker.ts`
- Create: `src/components/guide/TableOfContents.tsx`

**Step 1: Create the dynamic route**

`src/app/guides/[slug]/page.tsx`:
- Look up guide from registry by slug, call `notFound()` if missing
- Dynamically import MDX: `` import(`@/content/${slug}/index.mdx`) ``
- Render inside `<GuideLayout>`
- `generateStaticParams()` returns all guide slugs

**Step 2: Build GuideLayout**

`src/components/guide/GuideLayout.tsx`:
- Desktop: `grid grid-cols-[280px_1fr] gap-8` with sticky sidebar
- Tablet/Mobile: Sidebar collapses — FAB button (bottom-right) opens TOC in a bottom sheet
- ScrollProgress bar at top

**Step 3: Build ScrollProgress**

Fixed thin (3px) `bg-primary` bar at top that fills based on scroll position.

**Step 4: Build scroll-spy hook**

`src/hooks/useScrollSpy.ts` — `IntersectionObserver` on all `h2, h3` elements, tracks active section ID. Uses `rootMargin: '0px 0px -80% 0px'`.

**Step 5: Build useHeadings hook**

`src/hooks/useHeadings.ts` — queries `h2, h3` elements on mount, returns `Array<{id, text, level}>`.

**Step 6: Build useProgressTracker hook**

`src/hooks/useProgressTracker.ts` — tracks which sections user has scrolled past, persists to `localStorage` keyed by guide slug. Returns `{ completedSections, totalSections, percentComplete }`.

**Step 7: Build TableOfContents**

`src/components/guide/TableOfContents.tsx`:
- Renders nested list from `useHeadings()`
- Highlights active section from `useScrollSpy()` with `text-primary font-semibold` + left border
- Smooth scroll on click
- Framer Motion `layoutId` for active indicator

**Step 8: Build GuideSidebar**

`src/components/guide/GuideSidebar.tsx`:
- Sticky, contains guide title, difficulty badge, progress indicator, and `<TableOfContents />`
- On mobile: rendered inside Framer Motion slide-in sheet triggered by FAB

**Step 9: Create placeholder MDX content to test**

Create `src/content/notion/index.mdx` with a few H2 headings and placeholder text to verify the layout.

**Step 10: Verify the guide template**

Run: `npm run dev`, navigate to `/guides/notion`
Expected: Two-column layout with sticky sidebar, TOC highlighting on scroll, progress bar at top.

**Step 11: Commit**
```bash
git add src/app/guides/ src/components/guide/ src/hooks/ src/content/notion/
git commit -m "feat: add reusable guide layout with sidebar TOC, scroll-spy, and progress tracking"
```

---

## Task 8: Build Interactive Components

**Files:**
- Create: `src/components/interactive/Accordion.tsx`
- Create: `src/components/interactive/StepByStep.tsx`
- Create: `src/components/interactive/TipCallout.tsx`
- Create: `src/components/interactive/InfoCard.tsx`
- Create: `src/components/interactive/AnimatedDemo.tsx`
- Create: `src/components/interactive/ChecklistItem.tsx`
- Create: `src/components/mdx/MDXComponents.tsx`

**Step 1: Build Accordion**

Click header to toggle content. Framer Motion `AnimatePresence` with height animation. Chevron rotates. Props: `title`, `children`, `defaultOpen?`.

**Step 2: Build StepByStep**

Vertical stepper with numbered circles + connecting line. Each step expandable. Active step highlighted `bg-primary`. Framer Motion `whileInView` stagger. Props: `steps: Array<{title, content}>`.

**Step 3: Build TipCallout**

Styled box with left border accent. 4 variants: `tip` (green), `warning` (amber), `info` (blue), `important` (magenta/accent). Icon + subtle background tint.

**Step 4: Build InfoCard**

Compact card that expands on hover/tap to reveal full content. Framer Motion layout animation.

**Step 5: Build AnimatedDemo**

Mock software UI inside a "browser chrome" frame (fake title bar with colored dots). Types:
- `notion-sidebar` — animated sidebar with pages appearing/nesting
- `notion-database` — table transforming to board to gallery view
- `cowork-task` — task being analyzed → subtasks → parallel execution
- `cowork-setup` — Chat to Cowork mode transition

Built with Framer Motion sequences. Auto-plays `whileInView`, replay button.

**Step 6: Build ChecklistItem**

Checkbox with label. State persisted to `localStorage` by guide slug + item ID. Check animation with spring bounce.

**Step 7: Create MDXComponents mapping**

`src/components/mdx/MDXComponents.tsx` — maps HTML elements to styled versions (h1-h3, p, ul, ol, blockquote, code, pre) and registers custom components (Accordion, StepByStep, TipCallout, InfoCard, AnimatedDemo, ChecklistItem) for use in MDX.

`scroll-mt-24` on h2/h3 so TOC links scroll below sticky header.

**Step 8: Test interactive components with placeholder MDX**

Update the placeholder Notion MDX to include examples of each component. Verify they all render and animate correctly.

**Step 9: Commit**
```bash
git add src/components/interactive/ src/components/mdx/
git commit -m "feat: add interactive guide components (Accordion, StepByStep, AnimatedDemo, etc.)"
```

---

## Task 9: Author Notion Guide MDX Content

**Files:** Modify: `src/content/notion/index.mdx`

**Source content to merge:**
- `Mastering Notion: A Comprehensive Guide to Professional Workspace Architecture copy.md` (8 chapters — primary structure)
- `Notion New User Presentation Guide copy.md` (10 sections — weave onboarding flow into early chapters)

**Step 1: Write the full Notion guide MDX**

Structure into 8 sections matching the source, with interactive components embedded:

1. **Understanding Notion's Core Philosophy** — TipCallout (info), AnimatedDemo (notion-sidebar), Accordion (Pages vs Folders)
2. **Crafting the Professional Page** — StepByStep (icon, typography, width setup), table of font/width options
3. **The Content Layer: Blocks** — Accordion per block type, slash command reference
4. **Strategic Database Design** — AnimatedDemo (notion-database), InfoCards for property types
5. **Views, Filters, and Templates** — Accordion per view type, TipCallout for dashboard tips
6. **Buttons and Automations** — StepByStep for button configuration
7. **Notion Calendar and Mail** — TipCallout (TARA system), InfoCards for features
8. **Quick Start Checklist** — ChecklistItems for the 5-item checklist from the source

Weave the "New User Presentation Guide" sections (Getting Started, Navigating KB, Core Databases, Search, Collaboration) into chapters 1-4 for a beginner-friendly flow.

**Step 2: Verify the full guide renders**

Run: `npm run dev`, navigate to `/guides/notion`
Expected: Complete guide with all interactive components, working TOC, and smooth animations.

**Step 3: Commit**
```bash
git add src/content/notion/
git commit -m "feat: author complete Notion guide with interactive MDX content"
```

---

## Task 10: Author Claude Cowork Guide MDX Content

**Files:** Create: `src/content/claude-cowork/index.mdx`

**Source content:** `cowork_guide_content.md`

**Step 1: Write the Claude Cowork guide MDX**

Structure into 6 sections:

1. **What is Claude Cowork?** — TipCallout (availability info), AnimatedDemo (cowork-setup)
2. **Setting Up Cowork** — StepByStep (7 setup steps from source), TipCallout (must keep app open, use Opus)
3. **Key Capabilities** — InfoCards for each of the 5 capabilities
4. **How Cowork Runs Your Tasks** — AnimatedDemo (cowork-task), StepByStep showing the 5 execution phases
5. **Real-World Use Cases** — Accordions for each use case (document analysis, dashboards, parallel projects, etc.)
6. **Permissions, Limits, and Best Practices** — TipCallout (warning about regulated workloads), ChecklistItems for the 10 best practices

**Step 2: Verify the guide renders**

Run: `npm run dev`, navigate to `/guides/claude-cowork`
Expected: Complete guide with all interactive components, working TOC.

**Step 3: Commit**
```bash
git add src/content/claude-cowork/
git commit -m "feat: author complete Claude Cowork guide with interactive MDX content"
```

---

## Task 11: Responsive Design, Polish, and Accessibility

**Files:** Modify: Various component files for responsive breakpoints

**Step 1: Mobile guide experience**
- Add floating TOC button (bottom-right FAB) that opens bottom sheet on mobile
- Hamburger nav in Header for mobile
- Stack guide cards to single column on mobile
- Ensure 44px minimum tap targets on all interactive elements

**Step 2: AnimatedDemo responsive scaling**

Lazy load with `next/dynamic` + `ssr: false`. Scale down gracefully or show simplified version on mobile.

**Step 3: `prefers-reduced-motion` support**

Wrap all Framer Motion animations to respect the user's motion preference.

**Step 4: Accessibility pass**
- Keyboard navigation on all interactive components
- Focus visible indicators
- ARIA labels on icon-only buttons (hamburger, TOC FAB, Accordion toggle)
- Heading hierarchy (no skipped levels)

**Step 5: Typography polish**
- Prose max-width `65ch` for readability
- Code blocks: dark background with monospace font
- Consistent vertical rhythm

**Step 6: Test at key breakpoints**

Test at: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px, 1440px
Verify: sidebar collapse, card stacking, AnimatedDemo scaling, TOC FAB

**Step 7: Commit**
```bash
git add -A
git commit -m "feat: responsive design, accessibility, and visual polish"
```

---

## Task 12: Final Verification

**Step 1: Full functional test**

- [ ] Landing page renders both guide cards from registry
- [ ] Clicking Notion card navigates to `/guides/notion`
- [ ] Clicking Claude Cowork card navigates to `/guides/claude-cowork`
- [ ] Both guides render all MDX content with custom components
- [ ] Sidebar TOC generates links from headings
- [ ] Scroll spy highlights active section
- [ ] Progress tracking persists across reloads (localStorage)
- [ ] All Accordions open/close with animation
- [ ] All StepByStep components expand/collapse
- [ ] All AnimatedDemos play on scroll
- [ ] All ChecklistItems save state
- [ ] Header logo links home
- [ ] Mobile hamburger menu works
- [ ] Mobile TOC FAB opens bottom sheet
- [ ] Design tokens in `.ui-design/` match what's rendered

**Step 2: Performance check**

Run: `npm run build && npm run start`
Expected: Build completes without errors. Lighthouse scores 90+ on Performance, Accessibility, Best Practices.

**Step 3: Final commit**
```bash
git add -A
git commit -m "chore: final verification and build check"
```

---

## Verification (End-to-End)

1. `npm run dev` — verify landing page, both guides, all interactive components
2. `npm run build` — verify production build completes without errors
3. Test responsive at 375px, 768px, 1024px, 1440px
4. Check localStorage persistence: complete some checklist items, reload, verify they persist
5. Verify design tokens: confirm `.ui-design/tokens/tokens.css` values match rendered styles
6. Verify extensibility: adding a third guide requires only an entry in `src/lib/guides.ts` and creating `src/content/{new-slug}/index.mdx`
