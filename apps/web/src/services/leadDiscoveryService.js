import { api } from "../../../../convex/_generated/api";
import { convexClient } from "../lib/convex";

export const leadDiscoveryService = {
  async search({ query, category, location }) {
    return convexClient.action(api.leadDiscovery.search, {
      query: query || undefined, category: category || undefined, location: location || undefined,
    });
  },

  async suggest(input) {
    return convexClient.action(api.leadDiscovery.suggest, { input });
  },
};

export default leadDiscoveryService;
