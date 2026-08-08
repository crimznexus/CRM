import { api } from "../../../../convex/_generated/api";
import { convexClient } from "../lib/convex";

export const leadService = {
  async getLeads() {
    return convexClient.query(api.leads.list);
  },

  async getLead(id) {
    return convexClient.query(api.leads.get, { id });
  },

  async createLead(payload) {
    return convexClient.mutation(api.leads.create, payload);
  },

  async updateLead(id, payload) {
    return convexClient.mutation(api.leads.update, { id, changes: payload });
  },

  async deleteLead(id) {
    return convexClient.mutation(api.leads.remove, { id });
  },

  async addNote(id, note) {
    return convexClient.mutation(api.leads.addNote, { id, note });
  },
  async exportLeads() {
    const leads = await convexClient.query(api.leads.list);
    const columns = ["businessName", "ownerName", "email", "phone", "status", "source"];
    const csv = [columns.join(","), ...leads.map((lead) => columns.map((key) => `"${String(lead[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    return { data: new TextEncoder().encode(csv), headers: { "content-disposition": 'attachment; filename="leads.csv"' } };
  },
};

export default leadService;
