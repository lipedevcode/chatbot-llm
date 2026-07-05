import axios from "axios";

// Sem baseURL: as chamadas usam caminhos relativos (/api/...). Em dev passam pelo
// proxy do Vite (ver vite.config.ts); em produção assumem a mesma origem do front
// (servido atrás de um reverse-proxy). Assim evitamos cross-origin/CORS.
//
// timeout: sem isso o default do axios é 0 (infinito) — se o backend travar
// (ex.: chamada ao LLM sem resposta), a UI fica presa em loading pra sempre.
// 30s é generoso o bastante pra não cortar respostas legítimas de LLM com
// PDFs grandes anexados.
export const api = axios.create({ timeout: 30000 });

// Injeta o token em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o backend retornar 401 (sem token, token inválido/expirado, ou de usuário
// que não existe mais — ver JwtAuthFilter/SecurityConfig), limpa o token e
// manda pro login para o usuário autenticar de novo.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);