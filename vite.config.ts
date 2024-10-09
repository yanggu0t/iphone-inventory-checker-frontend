import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5555,
    proxy: {
      "/api": {
        target: "https://apple-api.yanggu0t.in/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/apple-cn": {
        target: "https://www.apple.com.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apple-cn/, ""),
      },
      "/apple": {
        target: "https://www.apple.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apple/, ""),
      },
    },
  },
});
