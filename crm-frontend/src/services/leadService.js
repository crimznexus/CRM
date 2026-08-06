import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the auth token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const leadService = {
  async getLeads(params = {}) {
    const { data } = await api.get("/leads", { params });
    return data;
  },

  async getLead(id) {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  },

  async createLead(payload) {
    const { data } = await api.post("/leads", payload);
    return data;
  },

  async updateLead(id, payload) {
    const { data } = await api.put(`/leads/${id}`, payload);
    return data;
  },

  async deleteLead(id) {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  },

  async addNote(id, note) {
    const { data } = await api.post(`/leads/${id}/notes`, { note });
    return data;
  },
  async exportLeads(params = {}) {
    const { data, headers } = await api.get(`/leads/export`, {
      params,
      responseType: "arraybuffer",
    });
    return { data, headers };
  },
};

export default leadService;