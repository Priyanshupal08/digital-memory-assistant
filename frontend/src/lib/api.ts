const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:54321";

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}