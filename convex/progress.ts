import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  return user;
}

export const getAllProgress = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return {};

    const rows = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const store: Record<string, {
      completedSections: string[];
      totalSections: number;
      percentComplete: number;
      lastAccessed: number;
      startedAt: number;
      completedAt: number | null;
    }> = {};

    for (const row of rows) {
      store[row.guideSlug] = {
        completedSections: row.completedSections,
        totalSections: row.totalSections,
        percentComplete: row.percentComplete,
        lastAccessed: row.lastAccessed,
        startedAt: row.startedAt,
        completedAt: row.completedAt ?? null,
      };
    }

    return store;
  },
});

export const upsertProgress = mutation({
  args: {
    guideSlug: v.string(),
    completedSections: v.array(v.string()),
    totalSections: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;

    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_guide", (q) =>
        q.eq("userId", user._id).eq("guideSlug", args.guideSlug)
      )
      .unique();

    const now = Date.now();
    const percent =
      args.totalSections > 0
        ? Math.round((args.completedSections.length / args.totalSections) * 100)
        : 0;

    if (existing) {
      await ctx.db.patch(existing._id, {
        completedSections: args.completedSections,
        totalSections: args.totalSections,
        percentComplete: percent,
        lastAccessed: now,
        completedAt: percent >= 100 ? (existing.completedAt ?? now) : undefined,
      });
    } else {
      await ctx.db.insert("userProgress", {
        userId: user._id,
        guideSlug: args.guideSlug,
        completedSections: args.completedSections,
        totalSections: args.totalSections,
        percentComplete: percent,
        lastAccessed: now,
        startedAt: now,
        completedAt: percent >= 100 ? now : undefined,
      });
    }

    return {
      completedSections: args.completedSections,
      totalSections: args.totalSections,
      percentComplete: percent,
      lastAccessed: now,
      startedAt: existing?.startedAt ?? now,
      completedAt: percent >= 100 ? (existing?.completedAt ?? now) : null,
    };
  },
});

export const resetAllProgress = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return;

    const rows = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const migrateLocalProgress = mutation({
  args: {
    entries: v.array(
      v.object({
        guideSlug: v.string(),
        completedSections: v.array(v.string()),
        totalSections: v.number(),
        percentComplete: v.number(),
        lastAccessed: v.number(),
        startedAt: v.number(),
        completedAt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return;

    const existingRows = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const existingSlugs = new Set(existingRows.map((r) => r.guideSlug));

    for (const entry of args.entries) {
      if (existingSlugs.has(entry.guideSlug)) continue;

      await ctx.db.insert("userProgress", {
        userId: user._id,
        guideSlug: entry.guideSlug,
        completedSections: entry.completedSections,
        totalSections: entry.totalSections,
        percentComplete: entry.percentComplete,
        lastAccessed: entry.lastAccessed,
        startedAt: entry.startedAt,
        completedAt: entry.completedAt,
      });
    }
  },
});
