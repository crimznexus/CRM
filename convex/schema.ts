import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const jsonValue = v.any();

export default defineSchema({
  workspaces: defineTable({
    companyName: v.string(),
    logoUrl: v.optional(v.string()),
    timeZone: v.string(),
    currency: v.string(),
    pipelineStages: v.optional(jsonValue),
    leadScoring: v.optional(jsonValue),
    automatedFollowups: v.optional(jsonValue),
    leadSourceTags: v.optional(jsonValue),
    updatedAt: v.number(),
  }),
  profiles: defineTable({
    authUserId: v.string(),
    workspaceId: v.id("workspaces"),
    fullName: v.string(),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
    notificationPreferences: v.optional(jsonValue),
    interfacePreference: v.union(v.literal("Light"), v.literal("Dark")),
    updatedAt: v.number(),
  })
    .index("by_auth_user_id", ["authUserId"])
    .index("by_workspace_id", ["workspaceId"]),
  leads: defineTable({
    workspaceId: v.id("workspaces"),
    businessName: v.string(),
    ownerName: v.optional(v.string()),
    category: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    group: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.string(),
    source: v.string(),
    googlePlaceId: v.optional(v.string()),
    googleMapsLink: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewsCount: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_and_status", ["workspaceId", "status"])
    .index("by_google_place_id", ["googlePlaceId"]),
  tasks: defineTable({
    workspaceId: v.id("workspaces"),
    leadId: v.optional(v.id("leads")),
    createdById: v.id("profiles"),
    assignedToId: v.optional(v.id("profiles")),
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
    status: v.union(v.literal("Open"), v.literal("Completed")),
    reminderEnabled: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_lead_id", ["leadId"]),
});
