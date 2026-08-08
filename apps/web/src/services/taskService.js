import { api } from "../../../../convex/_generated/api";
import { convexClient } from "../lib/convex";

export const taskService = {
  list: async () => convexClient.query(api.tasks.list),
  create: async (payload) => convexClient.mutation(api.tasks.create, Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== "" && value != null))),
  update: async (id, payload) => convexClient.mutation(api.tasks.update, { id, changes: Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== "" && value != null)) }),
  remove: async (id) => convexClient.mutation(api.tasks.remove, { id }),
};
