# Migrate GOAL Software Guides from Supabase to Convex + Clerk

## Context

The GOAL Software Guides web app currently uses Supabase for authentication (email/password) and a single `user_progress` PostgreSQL table to track per-user guide completion. The app is built with Next.js 16 (App Router), React 19, TypeScript, and deployed on Netlify.

The goal is to replace Supabase entirely with **Convex** (database + backend functions) and **Clerk** (authentication). Users will re-register fresh -- no data migration needed. Clerk is the production-recommended auth provider for Convex and provides built-in UI components, session management, and Clerk middleware for Next.js.

---

## Phase 1: Install Dependencies & Initialize Convex

### 1.1 Install packages
```bash
npm install convex @clerk/nextjs
npm uninstall @supabase/supabase-js @supabase/ssr
```

### 1.2 Initialize Convex
```bash
npx convex dev
```
This creates the `convex/` directory, generates `_generated/` types, and adds `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

### 1.3 Set up Clerk
- Create a Clerk application at dashboard.clerk.com (enable email/password auth method)
- Activate the Convex integration in Clerk Dashboard (copies JWT issuer domain)
- Add to `.env.local`:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  CLERK_JWT_ISSUER_DOMAIN=https://verb-noun-00.clerk.accounts.dev
  ```

---

## Phase 2: Create Convex Backend (New Files)

### 2.1 `convex/auth.config.ts` -- Clerk auth config
```ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

### 2.2 `convex/schema.ts` -- Database schema
```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),         // Clerk user subject ID
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  userProgress: defineTable({
    userId: v.id("users"),
    guideSlug: v.string(),
    completedSections: v.array(v.string()),
    totalSections: v.number(),
    percentComplete: v.number(),
    lastAccessed: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_guide", ["userId", "guideSlug"]),
});
```

### 2.3 `convex/users.ts` -- User sync + lookup

Two functions:
- **`current`** (query) - returns the Convex user doc for the authenticated Clerk user
- **`getOrCreate`** (mutation) - finds user by clerkId or creates one (called on first authenticated load)

The `getOrCreate` pattern: on first page load after Clerk sign-in, a mutation checks if a user with this `clerkId` exists. If not, it creates one from the Clerk identity (`ctx.auth.getUserIdentity()`). Returns the user doc with `_id`, `email`, `createdAt`.

### 2.4 `convex/progress.ts` -- All CRUD operations

Replaces every function in `src/lib/progress-sync.ts`:

| Convex Function | Type | Replaces |
|---|---|---|
| `getAllProgress` | query | `getAllProgressRemote()` |
| `upsertProgress` | mutation | `updateSectionProgressRemote()` |
| `resetAllProgress` | mutation | `resetAllProgressRemote()` |
| `getDashboardStats` | query | `getDashboardStatsRemote()` |
| `getRecentlyAccessed` | query | `getRecentlyAccessedRemote()` |
| `migrateLocalProgress` | mutation | `migrateLocalProgressToRemote()` |

Every function authenticates via `ctx.auth.getUserIdentity()`, looks up the Convex user by `clerkId`, then operates on `userProgress` using the `by_user` or `by_user_guide` indexes.

All queries are **reactive by default** -- the dashboard will auto-update when progress changes (improvement over current manual refetch).

---

## Phase 3: Frontend Provider Setup

### 3.1 Create `src/lib/convex.ts` (NEW -- replaces `src/lib/supabase/client.ts`)
```ts
import { ConvexReactClient } from "convex/react";
export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
```

### 3.2 Create `src/components/providers/ConvexClientProvider.tsx` (NEW)
Client component wrapping `ClerkProvider` > `ConvexProviderWithClerk`:
```ts
"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convex } from "@/lib/convex";

export function ConvexClientProvider({ children }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### 3.3 Modify `src/app/layout.tsx`
- Remove `AuthProvider` import
- Import and use `ConvexClientProvider` instead
- Keep `metadata` export (server component compatibility maintained via separate client wrapper)

### 3.4 Rewrite `src/hooks/useAuth.tsx`
Remove the entire `AuthProvider` / `AuthContext`. Replace with a thin hook wrapping Clerk + Convex:
```ts
export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.current, isAuthenticated ? {} : "skip");

  return {
    user: convexUser ?? null,   // Convex user doc with _id, email, createdAt
    clerkUser,                  // Clerk user for avatar/name if needed
    loading: isLoading,
    isAuthenticated,
    signOut: () => signOut(),
  };
}
```

This preserves the `useAuth()` API surface so most downstream consumers need minimal changes.

---

## Phase 4: Auth Pages & Middleware

### 4.1 Rewrite `src/middleware.ts`
Replace Supabase middleware with Clerk middleware:
```ts
import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
```

### 4.2 Create `src/components/auth/AuthGuard.tsx` (NEW)
Client-side route protection (wraps app in layout):
- If `isLoading`: show loading spinner
- If not authenticated and on protected route: redirect to `/login`
- If authenticated and on `/login` or `/signup`: redirect to `/`
- Calls `users.getOrCreate` mutation once on authenticated load to ensure Convex user exists
- Runs localStorage-to-Convex migration on first authenticated load (same as current `SIGNED_IN` handler)

### 4.3 Rewrite `src/app/(auth)/login/page.tsx`
Replace Supabase `signInWithPassword` with Clerk's `<SignIn />` component or a custom form using `useSignIn()` from `@clerk/nextjs`. The existing form UI (email/password fields, styling) can be preserved with Clerk's `useSignIn` hook as a drop-in for the Supabase call.

### 4.4 Rewrite `src/app/(auth)/signup/page.tsx`
Same approach: replace `supabase.auth.signUp` with Clerk's `useSignUp()` hook. Existing form JSX and validation stays.

### 4.5 Delete `src/lib/supabase/middleware.ts`
No longer needed -- replaced by Clerk middleware + AuthGuard.

---

## Phase 5: Data Layer Migration

### 5.1 Rewrite `src/hooks/useProgressTracker.ts`
- Replace `import { updateSectionProgressRemote } from '@/lib/progress-sync'` with `useMutation(api.progress.upsertProgress)`
- Replace `useAuth()` check with `useConvexAuth()` for `isAuthenticated`
- The debounced `syncToRemote` callback calls the Convex mutation instead of the Supabase function
- localStorage flow remains identical

### 5.2 Rewrite `src/hooks/useDashboardStats.ts`
- Replace imperative `useEffect` + `Promise.all` fetch with reactive `useQuery`:
  ```ts
  const remoteStats = useQuery(api.progress.getDashboardStats, isAuthenticated ? { totalGuides: guides.length } : "skip");
  const remoteRecent = useQuery(api.progress.getRecentlyAccessed, isAuthenticated ? {} : "skip");
  ```
- Guest localStorage fallback stays the same

### 5.3 Update `src/components/dashboard/CourseGrid.tsx`
- Replace `getAllProgressRemote()` fetch with `useQuery(api.progress.getAllProgress)`
- Guest fallback to `getAllProgress()` (localStorage) stays

### 5.4 Update `src/app/(dashboard)/page.tsx`
- Replace `resetAllProgressRemote()` with `useMutation(api.progress.resetAllProgress)`
- Replace `user.email` with `user?.email` (Convex user doc has `email` field)
- Remove `router.refresh()` calls (Convex reactivity handles updates)

### 5.5 Update `src/app/(dashboard)/account/page.tsx`
- Replace `getAllProgressRemote()` with `useQuery(api.progress.getAllProgress)`
- Replace `resetAllProgressRemote()` with `useMutation(api.progress.resetAllProgress)`
- Replace `user.created_at` with `user?.createdAt` (Convex user doc field)
- `signOut` comes from the updated `useAuth()` wrapper

### 5.6 Update `src/components/layout/TopBar.tsx`
- `useAuth()` still works via the wrapper; `user?.email` still works since the Convex user doc has an `email` field

---

## Phase 6: Cleanup

### Delete these files:
| File | Reason |
|------|--------|
| `src/lib/supabase/client.ts` | Replaced by `src/lib/convex.ts` |
| `src/lib/supabase/server.ts` | No server-side client needed |
| `src/lib/supabase/middleware.ts` | Replaced by Clerk middleware + AuthGuard |
| `src/lib/progress-sync.ts` | Replaced by `convex/progress.ts` |
| `src/lib/supabase/` directory | Fully replaced |

### Update config files:
| File | Change |
|------|--------|
| `.env.local` | Remove Supabase vars, add Clerk + Convex vars |
| `.env.local.example` | Update to list `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| `netlify.toml` | Update build command to `npx convex deploy --cmd 'npm run build'` |
| `package.json` | Supabase packages removed, convex + @clerk/nextjs added |

### Files that remain unchanged:
- `src/lib/progress.ts` -- pure localStorage operations
- `src/lib/guides.ts` -- static guide metadata
- All MDX content files in `src/content/`
- All pure UI components (GuideLayout, DashboardShell, AppSidebar, CourseCard, etc.)
- `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`
- `src/hooks/useTheme.ts`, `src/hooks/useHeadings.ts`, `src/hooks/useScrollSpy.ts`

---

## Complete File Change Summary

**New files (7):**
1. `convex/schema.ts`
2. `convex/auth.config.ts`
3. `convex/users.ts`
4. `convex/progress.ts`
5. `src/lib/convex.ts`
6. `src/components/providers/ConvexClientProvider.tsx`
7. `src/components/auth/AuthGuard.tsx`

**Modified files (10):**
1. `src/app/layout.tsx` -- swap provider
2. `src/hooks/useAuth.tsx` -- rewrite (remove AuthProvider, wrap Clerk+Convex hooks)
3. `src/middleware.ts` -- rewrite (Clerk middleware)
4. `src/app/(auth)/login/page.tsx` -- Clerk useSignIn
5. `src/app/(auth)/signup/page.tsx` -- Clerk useSignUp
6. `src/hooks/useProgressTracker.ts` -- Convex useMutation
7. `src/hooks/useDashboardStats.ts` -- Convex useQuery (reactive)
8. `src/components/dashboard/CourseGrid.tsx` -- Convex useQuery
9. `src/app/(dashboard)/page.tsx` -- Convex useMutation + user shape
10. `src/app/(dashboard)/account/page.tsx` -- Convex useQuery/useMutation + user shape

**Deleted files (5):**
1. `src/lib/supabase/client.ts`
2. `src/lib/supabase/server.ts`
3. `src/lib/supabase/middleware.ts`
4. `src/lib/progress-sync.ts`
5. `src/lib/supabase/` directory

---

## Implementation Order

Execute in this sequence to minimize broken state:

1. Install convex + @clerk/nextjs, uninstall Supabase packages
2. Create all Convex backend files (schema, auth.config, users, progress)
3. Run `npx convex dev` to validate schema and generate types
4. Create `src/lib/convex.ts` and `ConvexClientProvider.tsx`
5. Create `AuthGuard.tsx`
6. Rewrite `useAuth.tsx` (keep same export API)
7. Rewrite `src/middleware.ts` (Clerk)
8. Swap provider in `src/app/layout.tsx`
9. Rewrite auth pages (login, signup)
10. Rewrite data hooks (useProgressTracker, useDashboardStats)
11. Update consuming components (CourseGrid, DashboardPage, AccountPage, TopBar)
12. Delete Supabase files
13. Update env files and netlify.toml

---

## Verification

### After steps 1-3 (Backend):
- `npx convex dev` runs without schema errors
- Convex dashboard shows `users` and `userProgress` tables

### After steps 4-9 (Auth):
- App loads at localhost:3000
- Unauthenticated users redirected to `/login`
- Sign up creates a Clerk user + Convex user doc
- Sign in works and redirects to `/`
- Sign out redirects to `/login`

### After steps 10-11 (Data layer):
- Navigate to a guide, scroll through sections -- progress appears in Convex dashboard `userProgress` table
- localStorage still updates in parallel
- Dashboard shows correct stats (reactive updates)
- Account page shows user email, member since date, progress list
- "Reset Progress" clears both Convex and localStorage

### Final check:
- `npm run build` succeeds with zero TypeScript errors
- `grep -r "supabase" src/` returns zero results
- `grep -r "@supabase" package.json` returns zero results
- Deploy to Netlify preview, verify full flow works in production

---

## Key Convex Documentation References

- Database overview: https://docs.convex.dev/database
- Schema definitions: https://docs.convex.dev/database/schemas
- Query functions: https://docs.convex.dev/functions/query-functions
- Mutation functions: https://docs.convex.dev/functions/mutation-functions
- Reading data: https://docs.convex.dev/database/reading-data
- Writing data: https://docs.convex.dev/database/writing-data
- Clerk integration: https://docs.convex.dev/auth/clerk
- Auth in functions: https://docs.convex.dev/auth/functions-auth
- Next.js quickstart: https://docs.convex.dev/quickstart/nextjs
