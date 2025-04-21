import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Faz com que o servidor escute em todas as interfaces de rede
    host: true,
    // ou alternativamente: host: "0.0.0.0"
  },
});
