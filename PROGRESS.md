# GOAL Software Guides — Progress Log

## Project Overview
A Next.js web application that hosts interactive software training guides for GOAL (insurance agency software). Built with Tailwind v4, MDX content, and GOAL brand design tokens.

**Repo:** https://github.com/TomsTools11/goal-software-guides

---

## Latest Update (Mar 5, 2026 — Session 9)

### Changes This Session
- **Login/account system implemented** — full Supabase email/password auth with per-user progress tracking
- **New dependencies**: `@supabase/supabase-js` and `@supabase/ssr` added
- **Supabase client layer** (`src/lib/supabase/`):
  - `client.ts` — browser Supabase client (singleton via `createBrowserClient`)
  - `server.ts` — server Supabase client (cookie-based, for server components)
  - `middleware.ts` — session refresh helper for Next.js middleware
- **Auth middleware** (`src/middleware.ts`) — refreshes auth session on each request
- **AuthProvider** (`src/hooks/useAuth.tsx`) — React context providing `user`, `loading`, `signOut`; auto-migrates localStorage progress to Supabase on first login
- **Progress sync** (`src/lib/progress-sync.ts`) — Supabase CRUD mirroring `progress.ts` interface: `getAllProgressRemote`, `updateSectionProgressRemote`, `resetAllProgressRemote`, `migrateLocalProgressToRemote`
- **Auth pages**:
  - `src/app/(auth)/layout.tsx` — centered layout with GOAL logo (no sidebar)
  - `src/app/(auth)/login/page.tsx` — email/password login + "Continue as Guest" link
  - `src/app/(auth)/signup/page.tsx` — signup with password confirmation
- **Account page** (`src/app/(dashboard)/account/page.tsx`) — profile card, completed courses, remaining courses with progress bars, reset progress (danger zone)
- **Updated hooks** to branch on auth state:
  - `useProgressTracker.ts` — writes to localStorage always + debounced (1.5s) Supabase sync when logged in
  - `useDashboardStats.ts` — fetches from Supabase when logged in, localStorage when guest
- **Updated layout/nav**:
  - `TopBar.tsx` — avatar initial circle (logged in) or "Sign In" button (guest)
  - `AppSidebar.tsx` — "Account" nav link at bottom when logged in, "Sign In" when guest
- **Updated dashboard** (`page.tsx`) — "Welcome back, {email}" greeting, auth-aware reset (clears both Supabase + localStorage)
- **Updated CourseGrid** — auth-aware progress fetching
- **Root layout** (`src/app/layout.tsx`) — wrapped in `<AuthProvider>`
- **`.env.local.example`** created with required Supabase env var template
- **Guest mode preserved** — all existing localStorage-based progress still works for unauthenticated users
- **Build verified** — `npm run build` passes cleanly

### Before This Feature Works in Production
1. Run the SQL from `plans/login-account-progress-tracking.md` (section 1) in Supabase SQL Editor to create the `user_progress` table with RLS policies
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and Netlify env vars
3. Add Netlify domain to Supabase Auth > URL Configuration > Redirect URLs

### Previous Session (Session 8 — Mar 2, 2026)
- Online course redesign planned — comprehensive plan created (`plans/online-course-redesign.md`)
- 6-phase implementation plan for transforming site into structured online course platform

### Previous Session (Session 7 — Feb 27, 2026)
- CopyableTemplate component created (`src/components/interactive/CopyableTemplate.tsx`)
- Sales Demo SOP templates redesigned with `<CopyableTemplate>`
- Netlify build fix — added missing `guides` import to page.tsx
- Homepage progress reset implemented (from merged PR #2)

### Previous Session (Session 6 — Feb 27, 2026)
- Disposition Data Import SOP added (6th SOP, 11 chapters)
- DataTable component created for styled tables
- All markdown pipe tables replaced with `<DataTable>` across 3 files
- Table styling improved in MDXComponents.tsx
- AnimatedDemo light theme for Notion demos

### Previous Session (Session 5 — Feb 27, 2026)
- SOPs section added with 5 initial SOPs
- Guide categorization (`category: 'guide' | 'sop'`) and `getGuidesByCategory()` helper
- Landing page restructured into two sections with visual differentiation
- Reusable GuideCard component extracted
- 5 SOP MDX content files created from Notion GOAL Resources

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

## Current State (Mar 5, 2026 — Session 9)

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
- `DataTable.tsx` — styled data table with headers, row separators, and responsive scroll
- `CopyableTemplate.tsx` — structured template card with copy-to-clipboard, labeled fields, and bullet placeholders

**6. Hooks** (`src/hooks/`)
- `useHeadings.ts` — extracts headings from content
- `useScrollSpy.ts` — tracks active section on scroll
- `useProgressTracker.ts` — tracks reading progress (localStorage + Supabase sync when logged in)
- `useDashboardStats.ts` — dashboard stats (auth-aware: Supabase or localStorage)
- `useAuth.tsx` — AuthProvider context + `useAuth()` hook
- `useTheme.ts` — dark/light theme toggle

**7. Content & Routing**
- Guide registry (`src/lib/guides.ts`) with metadata for each guide
- Dynamic route: `src/app/guides/[slug]/page.tsx` with `GuideLayoutWrapper.tsx`
- Landing page (`src/app/page.tsx`) with guide cards and progress reset on visit
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
- `disposition-data-import-sop/index.mdx` — Disposition Data Import SOP (complete)

**9. Scripts** (`scripts/`)
- `capture-screenshots.ts` — Playwright-based Close CRM screenshot capture utility

**10. Auth & Progress Sync** (`src/lib/supabase/`, `src/lib/progress-sync.ts`)
- `supabase/client.ts` — browser Supabase client (singleton)
- `supabase/server.ts` — server Supabase client (cookie-based)
- `supabase/middleware.ts` — session refresh helper
- `progress-sync.ts` — Supabase CRUD for per-user progress
- `src/middleware.ts` — Next.js middleware for auth session refresh

**11. Auth Pages** (`src/app/(auth)/`)
- `layout.tsx` — centered auth layout with GOAL logo
- `login/page.tsx` — email/password login
- `signup/page.tsx` — signup with password confirmation

**12. Account Page** (`src/app/(dashboard)/account/page.tsx`)
- Profile card, completed courses, remaining courses, reset progress

**13. Plans** (`plans/`)
- `online-course-redesign.md` — 6-phase plan to transform site into online course platform
- `login-account-progress-tracking.md` — login/account system plan (implemented)

### Reference Materials (project root)
- `cowork_guide_content.md` — Claude Cowork guide source content
- `Mastering_Claude_Cowork.pdf` — Claude Cowork PDF reference
- `Mastering_Dia_Browser.pdf` — Dia Browser PDF reference
- `Goal Style Guide Brand + Layout Overview.md` — brand/design reference
- `Mastering Notion...copy.md` — Notion guide source content
- `Notion New User Presentation Guide copy.md` — Notion presentation source

---

## What's Next

### Login/Account System — Deploy Checklist
- [ ] Create `user_progress` table in Supabase (SQL in `plans/login-account-progress-tracking.md` section 1)
- [ ] Set Supabase env vars in `.env.local` and Netlify
- [ ] Add Netlify domain to Supabase Auth redirect URLs
- [ ] Test: guest mode still works, login/signup works, progress migrates, account page shows correct data

### Online Course Redesign (see `plans/online-course-redesign.md`)
- [ ] Phase 1: Data model (`course.ts`) + persistent progress hook (`useCourseProgress.ts`)
- [ ] Phase 2: Content splitting — split 9 MDX files into ~76 individual lesson files
- [ ] Phase 3: Lesson pages — new `/modules/[moduleSlug]/[lessonSlug]` routes with Mark Complete + prev/next nav
- [ ] Phase 4: Module overview pages — `/modules/[moduleSlug]` with lesson list and progress
- [ ] Phase 5: Course dashboard — welcome modal, overall progress, recently accessed, module cards
- [ ] Phase 6: Cleanup — redirects from old URLs, remove deprecated files, animation polish

### Content
- [ ] Create a Dia Browser guide

### Infrastructure
- [ ] Add search functionality across lessons
- [ ] Move reference PDFs/docs out of the repo root or into a `docs/` folder
- [ ] Replace placeholder Close CRM screenshots with live captures

---

## How to Run
```bash
cp .env.local.example .env.local   # then fill in Supabase URL + anon key
npm install
npm run dev
# Open http://localhost:3000
```
Note: The app works without Supabase env vars — auth features won't load but guest mode (localStorage) works fine.
