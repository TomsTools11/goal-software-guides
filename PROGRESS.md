# GOAL Software Guides — Progress Log

## Project Overview
A Next.js web application that hosts interactive software training guides for GOAL (insurance agency software). Built with Tailwind v4, MDX content, and GOAL brand design tokens.

**Repo:** https://github.com/TomsTools11/goal-software-guides

---

## Current State (Feb 26, 2026)

### What's Been Built

**1. Project Foundation**
- Next.js app scaffolded with TypeScript, Tailwind v4, and MDX support
- GOAL design token system (CSS custom properties, Tailwind config, TS constants, JSON)
- PostCSS and ESLint configured
- Brand assets in place (`goal_blk.png`, `goal_wht.png`, `gicon.png`)

**2. Layout Components** (`src/components/layout/`)
- `Header.tsx` — site header with GOAL branding
- `Footer.tsx` — site footer
- `Container.tsx` — responsive content wrapper

**3. UI Components** (`src/components/ui/`)
- `Button.tsx`
- `Card.tsx`
- `Badge.tsx`
- `ProgressBar.tsx`

**4. Guide System** (`src/components/guide/`)
- `GuideLayout.tsx` — reusable guide page layout
- `GuideSidebar.tsx` — sidebar navigation for guides
- `TableOfContents.tsx` — auto-generated TOC from headings
- `ScrollProgress.tsx` — reading progress indicator

**5. Interactive Components** (`src/components/interactive/`)
- `Accordion.tsx` — expandable/collapsible sections
- `StepByStep.tsx` — sequential step walkthroughs
- `AnimatedDemo.tsx` — animated demonstrations
- `ChecklistItem.tsx` — trackable checklist items
- `InfoCard.tsx` — highlighted info cards
- `TipCallout.tsx` — tip/warning callout blocks

**6. Hooks** (`src/hooks/`)
- `useHeadings.ts` — extracts headings from content
- `useScrollSpy.ts` — tracks active section on scroll
- `useProgressTracker.ts` — tracks reading progress

**7. Content & Routing**
- Guide registry (`src/lib/guides.ts`) with metadata for each guide
- Dynamic route: `src/app/guides/[slug]/page.tsx` with `GuideLayoutWrapper.tsx`
- Landing page (`src/app/page.tsx`) with guide cards
- MDX components mapping (`src/components/mdx/MDXComponents.tsx`)

**8. Content Directories** (`src/content/`)
- `notion/index.mdx` — Notion guide (started)
- `claude-cowork/` — Claude Cowork guide (directory created, content pending)

### Reference Materials (project root)
- `cowork_guide_content.md` — Claude Cowork guide source content
- `Mastering_Claude_Cowork.pdf` — Claude Cowork PDF reference
- `Mastering_Dia_Browser.pdf` — Dia Browser PDF reference
- `Goal Style Guide Brand + Layout Overview.md` — brand/design reference
- `Mastering Notion...copy.md` — Notion guide source content
- `Notion New User Presentation Guide copy.md` — Notion presentation source

---

## What's Next
- [ ] Finish writing the Notion guide MDX content
- [ ] Build out the Claude Cowork guide MDX content
- [ ] Create a Dia Browser guide
- [ ] Test the full app build (`npm run build`) and fix any issues
- [ ] Add search functionality across guides
- [ ] Deploy (Vercel or similar)
- [ ] Move reference PDFs/docs out of the repo root or into a `docs/` folder

---

## How to Run
```bash
npm install
npm run dev
# Open http://localhost:3000
```
