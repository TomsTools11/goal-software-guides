# Plan: Transform GOAL Software Guides into Online Course Platform

## Context

The GOAL Software Guides site currently serves 9 guides (3 software training + 6 SOPs) as long single-page MDX documents with scroll-based progress tracking that resets every visit. The goal is to transform it into a proper online course with module/lesson structure, persistent progress tracking, and a course dashboard — while keeping the existing tech stack (Next.js 16, Tailwind v4, MDX, Netlify) and requiring no new backend infrastructure.

**Decisions made:**
- Keep "Software Guides" and "SOPs" as separate dashboard sections
- Simple name-only prompt on first visit for personalization (no auth)
- localStorage for progress persistence (no Supabase)

---

## Phase 1: Data Model + Progress System

### 1a. Create `src/lib/course.ts` — new module/lesson registry

Replace `src/lib/guides.ts` with new types and registry:

```typescript
interface Lesson {
  slug: string;              // URL-friendly, e.g. "understanding-notions-core-philosophy"
  title: string;
  order: number;             // 1-based position within module
  estimatedMinutes: number;
}

interface Module {
  slug: string;              // keeps existing slugs (e.g. "notion")
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  category: 'guide' | 'sop';
  estimatedTime: string;
  lessons: Lesson[];
}
```

Helper functions: `getModuleBySlug()`, `getLessonBySlug()`, `getAdjacentLessons()` (prev/next), `getAllModules()`, `getModulesByCategory()`, `getAllLessonParams()` (for static generation).

### 1b. Create `src/hooks/useCourseProgress.ts` — persistent progress hook

Replaces `src/hooks/useProgressTracker.ts`. Single localStorage key: `goal-course-progress`.

```typescript
interface UserProfile { name: string; createdAt: string }
interface LessonProgress { completed: boolean; completedAt: string | null }

interface CourseProgress {
  user: UserProfile;
  lessons: Record<string, LessonProgress>;  // key: "moduleSlug/lessonSlug"
  lastAccessed: { moduleSlug: string; lessonSlug: string; at: string } | null;
}
```

Hook API:
- `user` / `setUser(name)` — profile management
- `isLessonComplete(moduleSlug, lessonSlug)` — check single lesson
- `markLessonComplete(moduleSlug, lessonSlug)` — toggle completion on
- `markLessonIncomplete(moduleSlug, lessonSlug)` — toggle completion off
- `getModuleProgress(moduleSlug)` — returns `{ completed, total, percent }`
- `getOverallProgress()` — returns `{ completed, total, percent }`
- `getRecentlyAccessed()` — returns last 3 accessed lessons
- `recordAccess(moduleSlug, lessonSlug)` — updates last accessed

Key change from current system: **no auto-reset**. Progress persists across sessions.

---

## Phase 2: Content Splitting

### 2a. Create `scripts/split-content.ts` — one-time migration script

Splits each `src/content/[slug]/index.mdx` into per-lesson files:

**Before:**
```
src/content/notion/index.mdx  (all 8 sections in one file)
```

**After:**
```
src/content/notion/
├── intro.mdx                    (h1 title + intro paragraph only)
└── lessons/
    ├── 01-understanding-notions-core-philosophy.mdx
    ├── 02-crafting-the-professional-page.mdx
    └── ... (one file per h2 section)
```

Splitting rules:
- Each `## ` heading starts a new lesson file
- The h1 + intro text before the first h2 becomes `intro.mdx`
- `---` horizontal rule separators between sections are removed
- Numeric prefix (`01-`) ensures filesystem ordering; URL slug strips the prefix
- All interactive component JSX stays intact (they always live within a single h2 section)

The script also outputs the `lessons[]` array data for `course.ts`.

### 2b. Run the split for all 9 modules

~76 total lesson files across all modules.

---

## Phase 3: Route Architecture + Lesson Pages

### 3a. New route structure

```
src/app/
├── page.tsx                                  # Course Dashboard (modified)
├── modules/
│   ├── [moduleSlug]/
│   │   ├── page.tsx                          # Module Overview (new)
│   │   └── [lessonSlug]/
│   │       └── page.tsx                      # Lesson Page (new)
├── guides/
│   └── [slug]/
│       └── page.tsx                          # Redirect → /modules/[slug]
```

### 3b. Create `src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx` — lesson route

Server component. Uses dynamic MDX import:
```typescript
const mod = await import(`@/content/${moduleSlug}/lessons/${lessonSlug}.mdx`);
```
Wraps content in `LessonLayout`. Generates static params from all module/lesson combinations.

### 3c. Create `src/components/course/LessonLayout.tsx`

Adapts the existing `GuideLayout.tsx` pattern (two-column, sidebar + content):
- **Sidebar**: Module title, module progress bar, lesson list with completion indicators, current lesson highlighted
- **Content area**: Breadcrumbs, lesson MDX content, "Mark as Complete" button at bottom
- **Bottom nav**: Previous Lesson / Next Lesson buttons
- **Mobile**: FAB opens bottom sheet with lesson list (same pattern as current mobile TOC)
- Keeps `ScrollProgress` bar at top

### 3d. Create `src/components/course/LessonSidebar.tsx`

Compact lesson list for sidebar:
- Module title and progress bar at top
- Each lesson: completion circle (green check or empty), title, estimated time
- Current lesson highlighted with primary color left border
- Sticky positioning (top-20)

### 3e. Create `src/components/course/MarkCompleteButton.tsx`

- Two states: "Mark as Complete" (primary button) / "Completed" (green success with checkmark)
- Clicking completed state shows undo toggle
- Framer Motion checkmark animation (consistent with existing `ChecklistItem`)
- Uses `useCourseProgress` hook

### 3f. Create `src/components/course/Breadcrumbs.tsx`

Simple: `Dashboard > Module Title > Lesson Title` with Next.js `Link` components.

---

## Phase 4: Module Overview Page

### 4a. Create `src/app/modules/[moduleSlug]/page.tsx` — module overview route

Server component. Imports `intro.mdx` for the module description. Renders `ModuleOverview`.

### 4b. Create `src/components/course/ModuleOverview.tsx`

- Breadcrumb: Dashboard > Module Title
- Module header: icon, title, description, difficulty badge, estimated time, progress bar
- Ordered lesson list: number, title, estimated time, completion checkmark, "current" indicator
- Each lesson row links to `/modules/[moduleSlug]/[lessonSlug]`
- "Start" / "Continue" / "Review" button (links to first incomplete or first lesson)

---

## Phase 5: Course Dashboard

### 5a. Create `src/components/course/WelcomeModal.tsx`

Shown on first visit (no user in localStorage):
- Clean modal with GOAL branding
- Single field: Name (required)
- "Get Started" button
- Stores via `useCourseProgress.setUser()`

### 5b. Create `src/components/course/ModuleCard.tsx`

Enhanced version of current `GuideCard`:
- Same icon, title, description, difficulty badge, tags, time
- Adds progress bar with percentage
- Button label: "Start" (0%) / "Continue" (1-99%) / "Review" (100%)
- Links to `/modules/[moduleSlug]`

### 5c. Create `src/components/course/CourseDashboard.tsx`

Replaces current homepage content:
- Greeting: "Welcome back, {name}"
- Overall progress bar: "X of Y lessons completed"
- "Recently Accessed" section: last 3 lessons with resume links
- "Software Guides" section: grid of module cards
- "Standard Operating Procedures" section: grid of module cards (with green left border, like current SOPs)
- Same Framer Motion `fadeUp` animation pattern

### 5d. Modify `src/app/page.tsx`

- Replace current content with `<CourseDashboard />`
- **Remove** the `useEffect` that clears all localStorage progress (lines 128-132)

### 5e. Modify `src/components/layout/Header.tsx`

- Change "Guides" nav link to "Dashboard" pointing to `/`
- Add user initial circle in top right (from `useCourseProgress`)

---

## Phase 6: Cleanup + Polish

### 6a. Backward compatibility

Modify `src/app/guides/[slug]/page.tsx` to redirect to `/modules/[slug]` instead of rendering content.

### 6b. Remove deprecated files

- Delete `src/app/guides/[slug]/GuideLayoutWrapper.tsx`
- Delete `src/hooks/useProgressTracker.ts`
- Delete `src/lib/guides.ts` (replaced by `course.ts`)
- Delete original single-file `src/content/*/index.mdx` (replaced by `intro.mdx` + `lessons/`)

### 6c. Animation polish

- Add Framer Motion transitions to new components (matching existing `fadeUp` pattern)
- Lesson page enter/exit transitions
- Mobile responsive testing across all new pages

---

## Files Summary

**Create:**
| File | Purpose |
|------|---------|
| `src/lib/course.ts` | Module/Lesson types + registry + helpers |
| `src/hooks/useCourseProgress.ts` | Persistent localStorage progress hook |
| `scripts/split-content.ts` | One-time MDX content splitter |
| `src/app/modules/[moduleSlug]/page.tsx` | Module overview route |
| `src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx` | Lesson route |
| `src/components/course/CourseDashboard.tsx` | Dashboard with progress overview |
| `src/components/course/ModuleOverview.tsx` | Module page with lesson list |
| `src/components/course/ModuleCard.tsx` | Card with progress bar |
| `src/components/course/LessonLayout.tsx` | Lesson page layout (sidebar + content + nav) |
| `src/components/course/LessonSidebar.tsx` | Lesson list sidebar |
| `src/components/course/MarkCompleteButton.tsx` | Explicit completion toggle |
| `src/components/course/Breadcrumbs.tsx` | Navigation breadcrumbs |
| `src/components/course/WelcomeModal.tsx` | First-visit name prompt |
| `src/content/*/intro.mdx` | Module intro text (9 files) |
| `src/content/*/lessons/*.mdx` | Individual lesson files (~76 files) |

**Modify:**
| File | Change |
|------|--------|
| `src/app/page.tsx` | Replace with CourseDashboard, remove progress reset |
| `src/app/guides/[slug]/page.tsx` | Replace with redirect to /modules/[slug] |
| `src/components/layout/Header.tsx` | Update nav label, add user display |

**Delete:**
| File | Reason |
|------|--------|
| `src/app/guides/[slug]/GuideLayoutWrapper.tsx` | Replaced by LessonLayout |
| `src/hooks/useProgressTracker.ts` | Replaced by useCourseProgress |
| `src/lib/guides.ts` | Replaced by course.ts |

**Unchanged:** All interactive components (`src/components/interactive/*`), MDXComponents.tsx, UI components, design tokens, Footer, Container, `next.config.mjs`, `netlify.toml`, `package.json` (no new deps).

---

## Verification

After each phase:
1. `npm run build` — ensure static generation succeeds
2. `npm run dev` — manual testing:
   - Phase 1-2: Verify content files split correctly
   - Phase 3: Navigate to `/modules/notion/understanding-notions-core-philosophy`, read content, mark complete, navigate prev/next, refresh and confirm progress persists
   - Phase 4: `/modules/notion` shows lesson list with completion states
   - Phase 5: `/` shows dashboard with progress, welcome modal on first visit, recently accessed works
   - Phase 6: `/guides/notion` redirects to `/modules/notion`, mobile responsive check
