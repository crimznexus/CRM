import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { requireProfile } from "./lib/auth";

const profileValue = v.object({
  id: v.id("profiles"),
  workspaceId: v.id("workspaces"),
  fullName: v.string(),
  email: v.string(),
  phoneNumber: v.optional(v.string()),
  role: v.union(v.literal("admin"), v.literal("member")),
  interfacePreference: v.union(v.literal("Light"), v.literal("Dark")),
  notificationPreferences: v.optional(v.any()),
});

const present = (profile: any) => ({
  id: profile._id,
  workspaceId: profile.workspaceId,
  fullName: profile.fullName,
  email: profile.email,
  phoneNumber: profile.phoneNumber,
  role: profile.role,
  interfacePreference: profile.interfacePreference,
  notificationPreferences: profile.notificationPreferences,
});

export const ensure = mutation({
  args: { companyName: v.string(), fullName: v.string(), phoneNumber: v.optional(v.string()) },
  returns: profileValue,
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    const existing = await ctx.db.query("profiles").withIndex("by_auth_user_id", (q) => q.eq("authUserId", authUser._id)).unique();
    if (existing) return present(existing);
    const now = Date.now();
    const workspaceId = await ctx.db.insert("workspaces", {
      companyName: args.companyName.trim() || `${args.fullName.trim()}'s Workspace`,
      timeZone: "UTC",
      currency: "USD",
      updatedAt: now,
    });
    const profileId = await ctx.db.insert("profiles", {
      authUserId: authUser._id,
      workspaceId,
      fullName: args.fullName.trim(),
      email: authUser.email,
      phoneNumber: args.phoneNumber?.trim() || undefined,
      role: "admin",
      interfacePreference: "Light",
      notificationPreferences: { emailAlerts: true, desktopPush: true, weeklySummary: false, mobileSMS: false },
      updatedAt: now,
    });
    const profile = await ctx.db.get(profileId);
    if (!profile) throw new Error("Profile creation failed.");
    return present(profile);
  },
});

export const me = query({ args: {}, returns: profileValue, handler: async (ctx) => present(await requireProfile(ctx)) });

export const update = mutation({
  args: {
    fullName: v.optional(v.string()), phoneNumber: v.optional(v.string()),
    interfacePreference: v.optional(v.union(v.literal("Light"), v.literal("Dark"))),
    notificationPreferences: v.optional(v.any()),
  },
  returns: profileValue,
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    const changes = Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined));
    await ctx.db.patch(profile._id, { ...changes, updatedAt: Date.now() });
    return present((await ctx.db.get(profile._id))!);
  },
});
