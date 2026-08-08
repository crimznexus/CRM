import { api } from "../../../../convex/_generated/api";
import { convexClient } from "../lib/convex";

export const workspaceService = {
  get: async () => convexClient.query(api.workspaces.get),
  update: async (payload) => convexClient.mutation(api.workspaces.update, payload),
  members: async () => convexClient.query(api.workspaces.members),
};
