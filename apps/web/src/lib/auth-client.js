import { createAuthClient } from "better-auth/react";
import { convexClient as convexAuthClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";
import { convexSiteUrl } from "./convex";

export const authClient = createAuthClient({
  baseURL: convexSiteUrl,
  plugins: [convexAuthClient(), crossDomainClient()],
});
