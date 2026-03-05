# Plan: Add Login/Account System with Per-User Progress Tracking

## Context

The GOAL Software Guides app is a Next.js 16 learning platform with 12 guides/SOPs. All progress is currently stored in browser localStorage — meaning progress is lost if the user switches devices or clears their browser. This plan adds simple email/password authentication via Supabase so progress is tied to individual user accounts and persists across devices. Guest mode (localStorage) is preserved for unauthenticated users.

---

## 1. Supabase Setup (Manual Steps)

In your existing Supabase project:

**Create `user_progress` table** (SQL Editor):
```sql
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  guide_slug text not null,
  completed_sections text[] not null default '{}',
  total_sections integer not null default 0,
  percent_complete integer not null default 0,
  last_accessed bigint not null default 0,
  started_at bigint not null default 0,
  completed_at bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, guide_slug)
);

create index idx_user_progress_user on public.user_progress(user_id);

-- Row Level Security
alter table public.user_progress enable row level security;

create policy "Users read own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on public.user_progress for update using (auth.uid() = user_id);
create policy "Users delete own progress" on public.user_progress for delete using (auth.uid() = user_id);
```

**Configure Auth**: In Authentication > URL Configuration, add your Netlify domain to Redirect URLs.

**Add env vars** to `.env.local` and Netlify:
```
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 2. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## 3. New Files to Create

| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Browser Supabase client (singleton via `createBrowserClient`) |
| `src/lib/supabase/server.ts` | Server Supabase client (cookie-based, for server components) |
| `src/lib/supabase/middleware.ts` | Session refresh helper for Next.js middleware |
| `src/middleware.ts` | Next.js middleware — refreshes auth session on each request |
| `src/hooks/useAuth.tsx` | AuthProvider context + `useAuth()` hook. Provides `user`, `loading`, `signOut`. Triggers localStorage-to-Supabase migration on first login. |
| `src/lib/progress-sync.ts` | Supabase CRUD for progress — mirrors `progress.ts` interface: `getAllProgressRemote`, `updateSectionProgressRemote`, `resetAllProgressRemote`, `migrateLocalProgressToRemote` |
| `src/app/(auth)/layout.tsx` | Centered auth layout (no sidebar) with GOAL logo |
| `src/app/(auth)/login/page.tsx` | Login form: email + password, links to signup and "Continue as Guest" |
| `src/app/(auth)/signup/page.tsx` | Signup form: email + password + confirm password |
| `src/app/(dashboard)/account/page.tsx` | Account page (see section 5) |

---

## 4. Files to Modify

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Wrap `{children}` in `<AuthProvider>` |
| `src/hooks/useProgressTracker.ts` | Branch on `useAuth()`: if logged in, use Supabase functions; if guest, use localStorage. Add debounce (1-2s) for Supabase writes. |
| `src/hooks/useDashboardStats.ts` | Branch on `useAuth()`: if logged in, fetch from Supabase via `getAllProgressRemote`; if guest, use localStorage. |
| `src/components/layout/TopBar.tsx` | Add user menu (logged in: avatar initial + link to `/account`) or "Sign In" link (guest) |
| `src/components/layout/AppSidebar.tsx` | Add "Account" nav link when logged in, "Sign In" when guest |
| `src/app/(dashboard)/page.tsx` | Auth-aware reset handler (Supabase vs localStorage). Optional greeting showing user email. |
| `src/components/dashboard/CourseGrid.tsx` | Auth-aware progress fetching |
| `package.json` | Add `@supabase/supabase-js` and `@supabase/ssr` |

**Not modified**: `src/lib/progress.ts` — stays as-is for guest mode.

---

## 5. Account Page Design

Route: `/account` (inside `(dashboard)` route group, so it gets the sidebar + topbar)

Sections:
1. **Profile Card** — user email, member since date, sign out button
2. **Completed Courses** — list of courses at 100% with completion dates
3. **Remaining Courses** — courses not yet completed, showing current progress %
4. **Reset Progress** — button to clear all progress (with confirmation)

---

## 6. Dashboard Updates

- Stats, recently accessed, and course grid all become user-specific when logged in
- "Welcome back, {email}" greeting for logged-in users
- Sign-in prompt for guest users
- Reset button calls Supabase delete for logged-in users

---

## 7. Migration Strategy (localStorage to Supabase)

Automatic on first login:
1. `AuthProvider` listens for `SIGNED_IN` event
2. Reads existing localStorage progress via `getAllProgress()`
3. Calls `migrateLocalProgressToRemote()` which upserts with `ignoreDuplicates: true` (never overwrites existing remote data)
4. Guest users continue using localStorage seamlessly

---

## 8. Implementation Order

1. Install dependencies
2. Create Supabase client files (`src/lib/supabase/`)
3. Create Next.js middleware (`src/middleware.ts`)
4. Create AuthProvider (`src/hooks/useAuth.tsx`)
5. Wrap root layout with AuthProvider
6. Create progress sync lib (`src/lib/progress-sync.ts`)
7. Create auth pages (login, signup, auth layout)
8. Update `useProgressTracker` and `useDashboardStats` hooks
9. Update TopBar and AppSidebar with auth UI
10. Update Dashboard page (greeting, auth-aware reset)
11. Update CourseGrid for auth-aware progress
12. Create Account page
13. Test: guest mode still works, login/signup works, progress migrates, account page shows correct data

---

## 9. Verification

- **Guest mode**: Visit site without logging in — progress saves to localStorage, dashboard works as before
- **Signup**: Create account with email/password — redirects to dashboard
- **Migration**: Any existing localStorage progress appears in dashboard after first login
- **Progress tracking**: Open a guide, scroll through sections — progress saves to Supabase (verify in Supabase dashboard table)
- **Account page**: Shows correct completed/remaining courses
- **Sign out + sign in**: Progress persists across sessions
- **Reset**: Clearing progress removes Supabase rows for that user
- **Multiple devices**: Login on different browser — same progress appears
