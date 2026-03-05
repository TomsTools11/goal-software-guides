import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
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
