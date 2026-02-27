# GOAL Software Guides — Progress Log

## Project Overview
A Next.js web application that hosts interactive software training guides for GOAL (insurance agency software). Built with Tailwind v4, MDX content, and GOAL brand design tokens.

**Repo:** https://github.com/TomsTools11/goal-software-guides

---

## Latest Update (Feb 27, 2026 — Session 5)

### Changes This Session
- **SOPs section added** — new "Standard Operating Procedures" category introduced alongside existing Software Guides
- **Guide categorization** — `category: 'guide' | 'sop'` field added to `GuideMetadata` interface with `getGuidesByCategory()` helper
- **Landing page restructured** — split from a single flat grid into two distinct sections: "Software Guides" and "Standard Operating Procedures" with section headers, divider, and visual differentiation (green left border accent on SOP cards, "View SOP" button label)
- **Reusable GuideCard component** — extracted shared card rendering into a `GuideCard` component used by both sections
- **5 SOP entries registered** in `guides.ts`: Account Review, Client Onboarding, Campaign Optimization, Right Pricing, GOAL Sales Demo
- **5 SOP icons added** to landing page icon map (Material Design icons with forest green `#0F4C35` backgrounds)
- **5 SOP MDX content files created** — all sourced from Notion GOAL Resources database:
  - `account-review-sop/index.mdx` — KPIs, 4-phase review cycle, escalation protocol, terminology
  - `client-onboarding-sop/index.mdx` — 3-phase onboarding, checklists, targeting vs modifiers, pitfalls
  - `campaign-optimization-sop/index.mdx` — 5-pillar optimization, feedback loop, budget controls, AI scoring
  - `right-pricing-sop/index.mdx` — 6-step bid management, Periscope dashboard, source modifiers
  - `sales-demo-sop/index.mdx` — full sales flow, discovery template, fee structure, scorecard

### Previous Session (Session 4 — Feb 27, 2026)
- Close CRM guide added with real screenshots
- Quiz and Screenshot interactive components built
- Landing page changed to 3-column grid
- Progress bar reset fix

### Previous Session (Session 3 — Feb 26, 2026)
- Guide icons replaced with inline Material Design SVGs
- Netlify deployment configured
- Responsive design and accessibility polish
- Progress bar and TOC fixes

### Previous Session (Session 2)
- Notion guide completed — full interactive MDX content authored
- Claude Cowork guide completed — full interactive MDX content authored
- GitHub repo created and pushed
- PROGRESS.md added

---

## Current State (Feb 27, 2026)

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
- `Quiz.tsx` — multiple-choice quiz with score tracking and answer feedback
- `Screenshot.tsx` — browser chrome frame for displaying app screenshots

**6. Hooks** (`src/hooks/`)
- `useHeadings.ts` — extracts headings from content
- `useScrollSpy.ts` — tracks active section on scroll
- `useProgressTracker.ts` — tracks reading progress

**7. Content & Routing**
- Guide registry (`src/lib/guides.ts`) with metadata for each guide
- Dynamic route: `src/app/guides/[slug]/page.tsx` with `GuideLayoutWrapper.tsx`
- Landing page (`src/app/page.tsx`) with guide cards
- MDX components mapping (`src/components/mdx/MDXComponents.tsx`)

**8. Guide Content** (`src/content/`)
- `notion/index.mdx` — Notion guide (complete)
- `claude-cowork/index.mdx` — Claude Cowork guide (complete)
- `close-crm/index.mdx` — Close CRM guide (complete)
- `account-review-sop/index.mdx` — Account Review SOP (complete)
- `client-onboarding-sop/index.mdx` — Client Onboarding SOP (complete)
- `campaign-optimization-sop/index.mdx` — Campaign Optimization SOP (complete)
- `right-pricing-sop/index.mdx` — Right Pricing SOP (complete)
- `sales-demo-sop/index.mdx` — GOAL Sales Demo SOP (complete)

**9. Scripts** (`scripts/`)
- `capture-screenshots.ts` — Playwright-based Close CRM screenshot capture utility

### Reference Materials (project root)
- `cowork_guide_content.md` — Claude Cowork guide source content
- `Mastering_Claude_Cowork.pdf` — Claude Cowork PDF reference
- `Mastering_Dia_Browser.pdf` — Dia Browser PDF reference
- `Goal Style Guide Brand + Layout Overview.md` — brand/design reference
- `Mastering Notion...copy.md` — Notion guide source content
- `Notion New User Presentation Guide copy.md` — Notion presentation source

---

## What's Next

### SOPs
- [x] ~~Account Review SOP MDX content~~
- [x] ~~Client Onboarding SOP MDX content~~
- [x] ~~Campaign Optimization SOP MDX content~~
- [x] ~~Right Pricing SOP MDX content~~
- [x] ~~GOAL Sales Demo SOP MDX content~~
- [x] ~~Verify all 5 SOP routes render correctly~~
- [ ] Build and deploy with SOPs

### Guides
- [x] ~~Finish writing the Notion guide MDX content~~
- [x] ~~Build out the Claude Cowork guide MDX content~~
- [x] ~~Build out the Close CRM guide MDX content~~
- [ ] Create a Dia Browser guide

### Infrastructure
- [x] ~~Test the full app build (`npm run build`) and fix any issues~~
- [x] ~~Deploy (Netlify configured)~~
- [ ] Add search functionality across guides
- [ ] Move reference PDFs/docs out of the repo root or into a `docs/` folder
- [ ] Replace placeholder Close CRM screenshots with live captures

---

## How to Run
```bash
npm install
npm run dev
# Open http://localhost:3000
```
