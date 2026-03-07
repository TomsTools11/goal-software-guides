# GOAL Software Guides — Progress Log

## Project Overview
A Next.js web application that hosts interactive software training guides for GOAL (insurance agency software). Built with Tailwind v4, MDX content, and GOAL brand design tokens.

**Repo:** https://github.com/TomsTools11/goal-software-guides

---

## Latest Update (Mar 7, 2026 — Session 15)

### Changes This Session
- **Category system restructured** — replaced binary `category: 'guide' | 'sop'` with multi-tag `categories: Category[]` where `Category = 'software' | 'account-management' | 'sales'`
  - Guides can now belong to multiple categories (e.g. Right Pricing → Account Management + Sales)
  - `CategoryTabs` updated: "Software Guides" / "SOPs" tabs → "Software" / "Account Management" / "Sales"
  - `CourseCard` shows multiple category badges per card using a `categoryBadge` lookup map
  - `CourseGrid` filtering uses `categories.includes()` instead of exact match
  - `AppSidebar` nav restructured into 3 sections: Software, Account Management, Sales
  - `GuideHeader` and `GuideNavigation` updated for new category structure
  - `guideIcons.tsx` — replaced single `SOP_ICON_BG` with `ACCT_MGMT_ICON_BG` (#0F4C35) and `SALES_ICON_BG` (#1A3A5C) for visual differentiation
- **New module: Consultative Campaign Targeting** (`src/content/consultative-targeting-sop/index.mdx`) — 8 chapters, ~30 min. Teaches reps to coach agents on campaign targeting: diagnosing over-filtering, day-parting, geo/bid-modifier strategy, and consultative discovery conversations
  - Registered in `src/lib/guides.ts` (total: 15 modules)
  - Icon added to `guideIcons.tsx` (target/bullseye icon with `SALES_ICON_BG`)
- **Fixed Quiz scroll-on-click** — clicking quiz options caused the page to scroll because hidden `<input type="radio">` with `sr-only` triggered browser scroll-to-focus. Replaced with `<div role="radio">` using ARIA attributes and keyboard handlers (`a3988f4`)
- **Fixed ObjectionCard overlap** — coaching tip was overlapping knowledge check due to absolute positioning; switched to CSS Grid stacking

### Previous Session (Session 14 — Mar 7, 2026)
- **2 new training modules added**:
  - **Brand Positioning for Captive Agents** (`src/content/brand-positioning-captive/index.mdx`) — 8 chapters, ~30 min. Covers ad positioning, landing page strategy, and bait-educate-reveal sales motion for captive agents
  - **TCPA Compliance & 1-to-1 Consent** (`src/content/tcpa-compliance/index.mdx`) — 8 chapters, ~45 min. Covers TCPA risk landscape, 1-to-1 consent, GOAL's proof stack, and objection handling
- **5 new interactive components**:
  - `FunnelVisualization.tsx` — animated step-by-step funnel diagram
  - `BeforeAfter.tsx` — side-by-side before/after comparison
  - `ObjectionCard.tsx` — flip card for objection/response practice
  - `ScriptBlock.tsx` — formatted script lines with speaker labels
  - `RevealCard.tsx` — progressive reveal with stage tracking
- **Registered new components in MDX** — added all 5 new components to `src/components/mdx/MDXComponents.tsx`
- **Registered new modules in guide registry** — added both new modules to `src/lib/guides.ts` (total: 14 guides/SOPs)
- **Fixed CopyableTemplate text cutoff** — placeholder text in `CopyableTemplate.tsx` was getting clipped because the field layout forced label + dashed separator + text onto a single flex row with `shrink-0`. Restructured so placeholder text flows inline with the label and wraps naturally. Also fixed `buildCopyText` to include placeholder text when copying. Affects all 6 modules using CopyableTemplate.

### Previous Session (Session 13 — Mar 7, 2026)
- **Fixed critical production crash** — React error #185 (maximum update depth exceeded) on all guide/SOP pages
  - **Root cause**: `useHeadings` hook used `useSyncExternalStore` with a `getSnapshot` function (`getHeadingsFromDOM`) that returned a new array reference on every call. Combined with a `requestAnimationFrame`-based `subscribe`, this created an infinite re-render loop: rAF fires → new snapshot (new array) → re-render → re-subscribe → rAF fires → repeat
  - **Fix**: Replaced `useSyncExternalStore` with `useState` + `useEffect` in `src/hooks/useHeadings.ts` — headings are read once after mount via `requestAnimationFrame`, producing a stable state value
  - **Commit**: `19eb027`

### Previous Session (Session 12 — Mar 6, 2026)
- **Codebase refactoring and cleanup** — fixed all ESLint errors, removed dead code, consolidated patterns
  - **Fixed 7 ESLint errors** (`react-hooks/set-state-in-effect`): replaced `useState` + `useEffect` patterns with `useSyncExternalStore` and lazy initializers across `useTheme`, `useHeadings`, `ChecklistItem`, `Quiz`, `ScrollProgress`, `AnimatedDemo`, `useProgressTracker`
  - **Removed dead code**: deleted unused `getDashboardStats` and `getRecentlyAccessed` from `convex/progress.ts` (never called from frontend) and matching unused wrappers from `src/lib/progress.ts`
  - **Consolidated `ProgressStore` type**: exported once from `src/lib/progress.ts`, removed 2 duplicate definitions in `useDashboardStats.ts` and `account/page.tsx`
  - **Unified auth state**: added `convexAuthenticated` field to `useAuth()` hook, removed redundant `useConvexAuth()` imports from Dashboard and Account pages
  - **Fixed hardcoded SOP badge**: replaced inline `style={{ backgroundColor: '#166534' }}` with `<Badge variant="success">` design system component
  - **Fixed `ContinueLearning` missing fallback icon**: switched from direct `guideIcons[slug]` access to `getGuideIcon(slug)` which has a default icon fallback
  - **Added missing `type="button"`** on Sign Out and Reset Progress buttons in Account page
  - **Extracted magic number**: `1500` debounce delay → named constant `SYNC_DEBOUNCE_MS`
- **Lint status**: 0 errors, 5 warnings (all in auto-generated `convex/_generated/` files)
- **Pushed to GitHub**: commit `e44fdab`

### Previous Session (Session 11 — Mar 5, 2026)
- **Migrated from Supabase to Convex + Clerk** — complete backend and auth replacement
  - **Auth**: Supabase email/password replaced with Clerk Google OAuth
  - **Database**: Supabase PostgreSQL replaced with Convex (reactive, real-time)
  - **Middleware**: Supabase session middleware replaced with `clerkMiddleware()` + `createRouteMatcher()` for server-side route protection
- **New Convex backend** (`convex/`):
  - `schema.ts` — `users` and `userProgress` tables with indexes
  - `auth.config.ts` — Clerk JWT issuer domain config
  - `users.ts` — `current` query + `getOrCreate` mutation
  - `progress.ts` — full CRUD: `getAllProgress`, `upsertProgress`, `resetAllProgress`, `migrateLocalProgress`
- **New frontend providers**:
  - `src/components/providers/ConvexClientProvider.tsx` — `ClerkProvider` > `ConvexProviderWithClerk` wrapper
  - `src/components/auth/AuthGuard.tsx` — Convex user sync + localStorage-to-Convex migration on first authenticated load
  - `src/lib/convex.ts` — `ConvexReactClient` initialization
- **Rewritten hooks**:
  - `useAuth.tsx` — wraps Clerk (`useUser`, `useClerk`) + Convex (`useConvexAuth`, `useQuery`); exposes `user` (Convex doc), `clerkUser` (Clerk user), `isAuthenticated`, `convexAuthenticated`, `signOut`
  - `useProgressTracker.ts` — Convex `useMutation(api.progress.upsertProgress)` replaces Supabase sync
  - `useDashboardStats.ts` — reactive `useQuery` replaces imperative fetch; auto-updates on progress changes
- **Auth pages**: Login and signup now use Clerk's `<SignIn />` and `<SignUp />` components (Google OAuth)
- **Dashboard + Account pages**: use `clerkUser` for display (email, avatar, member since), Convex queries for progress data
- **Deleted files**:
  - `src/lib/supabase/` directory (client.ts, server.ts, middleware.ts)
  - `src/lib/progress-sync.ts`
- **Config updates**:
  - `netlify.toml` — build command: `npx convex deploy --cmd 'npm run build'`
  - `.env.local.example` — Convex + Clerk env var template
  - `package.json` — removed `@supabase/supabase-js`, `@supabase/ssr`; added `convex`, `@clerk/nextjs`
- **Bug fix**: AppSidebar missing `key` prop on nav links
- **Deployed to Netlify** with Convex production deployment

### Previous Session (Session 10 — Mar 5, 2026)
- **Auth-gated access** — guest mode removed; all routes now require authentication
  - Middleware redirects unauthenticated users to `/login` and authenticated users away from auth pages
  - "Continue as Guest" links removed from login and signup pages
  - Login/signup copy updated ("access your training courses" instead of "track progress across devices")
  - Auth layout updated with "Training Platform" subtitle under GOAL logo
  - Sidebar always shows "Account" link (removed guest "Sign In" fallback)
  - TopBar always shows avatar circle (removed guest "Sign In" button)
- **Auth layout logo fix** — replaced Tailwind v4 `dark:` variant (which uses `prefers-color-scheme`) with `useThemeProvider()` to match the app's `.dark` class toggle

### Previous Session (Session 9 — Mar 5, 2026)
- **Login/account system implemented** — full Supabase email/password auth with per-user progress tracking
- **New dependencies**: `@supabase/supabase-js` and `@supabase/ssr` added
- **Supabase client layer**, **Auth middleware**, **AuthProvider**, **Progress sync**, **Auth pages**, **Account page** all created
- **Guest mode preserved** — localStorage-based progress for unauthenticated users
- **Build verified** — `npm run build` passes cleanly

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

## Current State (Mar 7, 2026 — Session 15)

### What's Been Built

**1. Project Foundation**
- Next.js 16 app with TypeScript, Tailwind v4, and MDX support
- GOAL design token system (CSS custom properties, Tailwind config, TS constants, JSON)
- PostCSS and ESLint configured
- Brand assets in place (`goal_blk.png`, `goal_wht.png`, `gicon.png`)

**2. Layout Components** (`src/components/layout/`)
- `DashboardShell.tsx` — main app shell with sidebar + topbar
- `AppSidebar.tsx` — sidebar navigation with Software, Account Management, and Sales sections
- `TopBar.tsx` — top bar with search, theme toggle, user avatar

**3. UI Components** (`src/components/ui/`)
- `Button.tsx`
- `Badge.tsx`
- `ProgressBar.tsx`

**4. Guide System** (`src/components/guide/`)
- `GuideLayout.tsx` — reusable guide page layout
- `GuideSidebar.tsx` — sidebar navigation for guides
- `TableOfContents.tsx` — auto-generated TOC from headings
- `ScrollProgress.tsx` — reading progress indicator
- `GuideHeader.tsx` — guide header with metadata
- `GuideNavigation.tsx` — prev/next navigation

**5. Interactive Components** (`src/components/interactive/`)
- `Accordion.tsx` — expandable/collapsible sections
- `StepByStep.tsx` — sequential step walkthroughs
- `AnimatedDemo.tsx` — animated demonstrations
- `ChecklistItem.tsx` — trackable checklist items
- `InfoCard.tsx` — highlighted info cards
- `TipCallout.tsx` — tip/warning callout blocks
- `Quiz.tsx` — multiple-choice quiz with score tracking and answer feedback (ARIA role="radio" for accessibility)
- `Screenshot.tsx` — browser chrome frame for displaying app screenshots
- `BrowserChrome.tsx` — browser chrome wrapper
- `DataTable.tsx` — styled data table with headers, row separators, and responsive scroll
- `CopyableTemplate.tsx` — structured template card with copy-to-clipboard (text wraps naturally)
- `FunnelVisualization.tsx` — animated step-by-step funnel diagram
- `BeforeAfter.tsx` — side-by-side before/after comparison
- `ObjectionCard.tsx` — flip card for objection/response practice
- `ScriptBlock.tsx` — formatted script lines with speaker labels
- `RevealCard.tsx` — progressive reveal with stage tracking

**6. Dashboard Components** (`src/components/dashboard/`)
- `StatsOverview.tsx` — stats cards (total, completed, in progress, not started)
- `ContinueLearning.tsx` — recently accessed in-progress courses
- `CourseGrid.tsx` — filterable course card grid
- `CourseCard.tsx` — individual course card with progress
- `CategoryTabs.tsx` — Software / Account Management / Sales filter tabs
- `StatCard.tsx` — individual stat card
- `guideIcons.tsx` — SVG icons for each guide

**7. Auth & Backend**
- **Clerk** (`@clerk/nextjs`) — Google OAuth authentication
  - `src/middleware.ts` — `clerkMiddleware()` with server-side route protection
  - `src/components/providers/ConvexClientProvider.tsx` — ClerkProvider + ConvexProviderWithClerk
  - `src/app/(auth)/login/page.tsx` — Clerk `<SignIn />` component
  - `src/app/(auth)/signup/page.tsx` — Clerk `<SignUp />` component
- **Convex** — reactive database + backend functions
  - `convex/schema.ts` — `users` + `userProgress` tables
  - `convex/auth.config.ts` — Clerk JWT validation
  - `convex/users.ts` — user lookup/creation
  - `convex/progress.ts` — all progress CRUD operations
  - `src/lib/convex.ts` — ConvexReactClient
  - `src/components/auth/AuthGuard.tsx` — user sync + localStorage migration

**8. Hooks** (`src/hooks/`)
- `useHeadings.ts` — extracts headings from content (useState + useEffect, reads once after mount)
- `useScrollSpy.ts` — tracks active section on scroll
- `useProgressTracker.ts` — tracks reading progress (localStorage + Convex sync when logged in)
- `useDashboardStats.ts` — reactive dashboard stats via Convex `useQuery`
- `useAuth.tsx` — unified auth hook wrapping Clerk + Convex
- `useTheme.ts` — dark/light theme toggle

**9. Content & Routing**
- Guide registry (`src/lib/guides.ts`) with metadata for 15 modules across 3 categories (`software`, `account-management`, `sales`)
- Dynamic route: `src/app/(dashboard)/guides/[slug]/page.tsx` with `GuideLayoutWrapper.tsx`
- Dashboard page (`src/app/(dashboard)/page.tsx`) with stats, continue learning, course grid
- Account page (`src/app/(dashboard)/account/page.tsx`) with profile, progress, sign out
- MDX components mapping (`src/components/mdx/MDXComponents.tsx`)

**10. Guide Content** (`src/content/`) — 15 modules

*Software:*
- `notion/index.mdx` — Mastering Notion (8 chapters)
- `claude-cowork/index.mdx` — Getting Started with Claude Cowork (6 chapters)
- `close-crm/index.mdx` — Mastering Close CRM (7 chapters)

*Account Management:*
- `account-review-sop/index.mdx` — Account Reviews (5 sections)
- `client-onboarding-sop/index.mdx` — Onboarding New Clients (4 sections)
- `campaign-optimization-sop/index.mdx` — Optimizing Campaigns (8 sections)
- `right-pricing-sop/index.mdx` — Right Pricing (5 sections)
- `sales-demo-sop/index.mdx` — GOAL Sales Demo (7 sections)
- `disposition-data-import-sop/index.mdx` — Importing Disposition Data (11 sections)

*Sales:*
- `sales-discovery-process/index.mdx` — GOAL Sales Discovery Process (9 sections)
- `setting-expectations-sop/index.mdx` — Setting Expectations & Handling Objections (8 sections)
- `competition-research/index.mdx` — GOAL Competition Research (8 sections)
- `brand-positioning-captive/index.mdx` — Brand Positioning for Captive Agents (8 sections)
- `tcpa-compliance/index.mdx` — TCPA Compliance & 1-to-1 Consent (8 sections)
- `consultative-targeting-sop/index.mdx` — Consultative Campaign Targeting (8 sections)

**11. Scripts** (`scripts/`)
- `capture-screenshots.ts` — Playwright-based Close CRM screenshot capture utility

**12. Plans** (`plans/`)
- `online-course-redesign.md` — 6-phase plan to transform site into online course platform
- `login-account-progress-tracking.md` — login/account system plan (implemented, then migrated to Convex+Clerk)

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Content | MDX |
| Auth | Clerk (Google OAuth) |
| Database | Convex (reactive) |
| Hosting | Netlify |

---

## What's Next

### Clerk Production Setup
- [ ] Switch Clerk to production instance
- [ ] Set up Google OAuth credentials (Google Cloud Console)
- [ ] Update Netlify env vars with production Clerk keys (`pk_live_`, `sk_live_`)
- [ ] Update Convex dashboard `CLERK_JWT_ISSUER_DOMAIN` with production issuer URL

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
# 1. Install dependencies
npm install

# 2. Start Convex dev server (generates types, syncs schema)
npx convex dev

# 3. In a separate terminal, start Next.js
npm run dev
# Open http://localhost:3000
```

### Environment Variables
Clerk keys are optional for local dev (keyless mode auto-provisions). For full functionality:
```
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

The `CLERK_JWT_ISSUER_DOMAIN` environment variable is set on the Convex dashboard (not in `.env.local`).
