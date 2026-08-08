import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireProfile } from "./lib/auth";

const workspaceValue = v.object({
  id: v.id("workspaces"), companyName: v.string(), logoUrl: v.optional(v.string()), timeZone: v.string(), currency: v.string(),
  pipelineStages: v.optional(v.any()), leadScoring: v.optional(v.any()), automatedFollowups: v.optional(v.any()), leadSourceTags: v.optional(v.any()),
});
const present = (w: any) => ({ id: w._id, companyName: w.companyName, logoUrl: w.logoUrl, timeZone: w.timeZone, currency: w.currency, pipelineStages: w.pipelineStages, leadScoring: w.leadScoring, automatedFollowups: w.automatedFollowups, leadSourceTags: w.leadSourceTags });

export const get = query({ args: {}, returns: workspaceValue, handler: async (ctx) => { const p = await requireProfile(ctx); return present((await ctx.db.get(p.workspaceId))!); } });
export const update = mutation({
  args: { companyName: v.optional(v.string()), logoUrl: v.optional(v.string()), timeZone: v.optional(v.string()), currency: v.optional(v.string()), pipelineStages: v.optional(v.any()), leadScoring: v.optional(v.any()), automatedFollowups: v.optional(v.any()), leadSourceTags: v.optional(v.any()) },
  returns: workspaceValue,
  handler: async (ctx, args) => { const p = await requireProfile(ctx); const changes = Object.fromEntries(Object.entries(args).filter(([, x]) => x !== undefined)); await ctx.db.patch(p.workspaceId, { ...changes, updatedAt: Date.now() }); return present((await ctx.db.get(p.workspaceId))!); },
});
export const members = query({ args: {}, returns: v.array(v.object({ id: v.id("profiles"), fullName: v.string(), email: v.string(), role: v.union(v.literal("admin"), v.literal("member")) })), handler: async (ctx) => { const p = await requireProfile(ctx); const rows = await ctx.db.query("profiles").withIndex("by_workspace_id", (q) => q.eq("workspaceId", p.workspaceId)).collect(); return rows.map((x) => ({ id: x._id, fullName: x.fullName, email: x.email, role: x.role })); } });
