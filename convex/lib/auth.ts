import { ConvexError } from "convex/values";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel, Doc } from "../_generated/dataModel";
import { authComponent } from "../auth";

type Ctx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

export async function requireProfile(ctx: Ctx): Promise<Doc<"profiles">> {
  const authUser = await authComponent.getAuthUser(ctx);
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_auth_user_id", (q) => q.eq("authUserId", authUser._id))
    .unique();
  if (!profile) throw new ConvexError("CRM profile has not been initialized.");
  return profile;
}
