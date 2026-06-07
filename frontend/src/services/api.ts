import axios from "axios";

// Sem baseURL: as chamadas usam caminhos relativos (/api/...). Em dev passam pelo
// proxy do Vite (ver vite.config.ts); em produção assumem a mesma origem do front
// (servido atrás de um reverse-proxy). Assim evitamos cross-origin/CORS.
export const api = axios.create();

// Injeta o token em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o backend retornar 401, limpa o token e redireciona para o início
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);