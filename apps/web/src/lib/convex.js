import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is required. Run `npx convex dev` or configure it in Vercel.");
}

export const convexClient = new ConvexReactClient(convexUrl);

export const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL ||
  convexUrl.replace(".convex.cloud", ".convex.site");
