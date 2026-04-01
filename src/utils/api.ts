export const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000/api").replace(/\/+$/, "");

export function apiUrl(endpoint: string): string {
  if (!endpoint) return API_BASE;
  return endpoint.startsWith("/") ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`;
}


