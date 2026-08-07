import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const workspaceService = {
  get: async () => (await api.get("/workspace")).data,
  update: async (payload) => (await api.put("/workspace", payload)).data,
  members: async () => (await api.get("/workspace/members")).data,
};
