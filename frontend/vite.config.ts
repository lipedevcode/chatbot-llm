import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      // Toda requisição /api/* do front é redirecionada para o backend em dev.
      // VITE_API_URL afeta APENAS o target deste proxy (lado Node) — o cliente
      // (axios) sempre usa caminhos relativos, então não há cross-origin/CORS.
      "/api": {
        target: process.env.VITE_API_URL ?? "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});