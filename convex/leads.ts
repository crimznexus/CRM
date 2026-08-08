import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireProfile } from "./lib/auth";

const leadFields = {
  businessName: v.string(), ownerName: v.optional(v.string()), category: v.optional(v.string()), phone: v.optional(v.string()), email: v.optional(v.string()), website: v.optional(v.string()), address: v.optional(v.string()), facebook: v.optional(v.string()), instagram: v.optional(v.string()), linkedin: v.optional(v.string()), group: v.optional(v.string()), assignedTo: v.optional(v.string()), notes: v.optional(v.string()), status: v.optional(v.string()), source: v.optional(v.string()), googlePlaceId: v.optional(v.string()), googleMapsLink: v.optional(v.string()), rating: v.optional(v.number()), reviewsCount: v.optional(v.number()),
};
const leadValue = v.any();
const present = (x: any) => ({ ...x, id: x._id, createdAt: new Date(x._creationTime).toISOString(), updatedAt: new Date(x.updatedAt).toISOString() });

async function owned(ctx: any, id: any) { const p = await requireProfile(ctx); const row = await ctx.db.get(id); if (!row || row.workspaceId !== p.workspaceId) throw new ConvexError("Lead not found."); return row; }
export const list = query({ args: {}, returns: v.array(leadValue), handler: async (ctx) => { const p = await requireProfile(ctx); const rows = await ctx.db.query("leads").withIndex("by_workspace_id", (q) => q.eq("workspaceId", p.workspaceId)).order("desc").collect(); return rows.map(present); } });
export const get = query({ args: { id: v.id("leads") }, returns: leadValue, handler: async (ctx, { id }) => present(await owned(ctx, id)) });
export const create = mutation({ args: leadFields, returns: leadValue, handler: async (ctx, args) => { const p = await requireProfile(ctx); const id = await ctx.db.insert("leads", { ...args, businessName: args.businessName.trim(), workspaceId: p.workspaceId, status: args.status ?? "New", source: args.source ?? "Manual", reviewsCount: args.reviewsCount ?? 0, updatedAt: Date.now() }); return present((await ctx.db.get(id))!); } });
export const update = mutation({ args: { id: v.id("leads"), changes: v.object({ ...leadFields, businessName: v.optional(v.string()) }) }, returns: leadValue, handler: async (ctx, { id, changes }) => { await owned(ctx, id); const clean = Object.fromEntries(Object.entries(changes).filter(([, x]) => x !== undefined)); await ctx.db.patch(id, { ...clean, updatedAt: Date.now() }); return present((await ctx.db.get(id))!); } });
export const remove = mutation({ args: { id: v.id("leads") }, returns: v.null(), handler: async (ctx, { id }) => { await owned(ctx, id); await ctx.db.delete(id); return null; } });
export const addNote = mutation({ args: { id: v.id("leads"), note: v.string() }, returns: leadValue, handler: async (ctx, { id, note }) => { const row = await owned(ctx, id); const value = note.trim(); if (!value) throw new ConvexError("Note is required."); await ctx.db.patch(id, { notes: [row.notes, value].filter(Boolean).join("\n\n"), updatedAt: Date.now() }); return present((await ctx.db.get(id))!); } });
