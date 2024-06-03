import path from "path"
import react from "@vitejs/plugin-react"
import svgrPlugin from "vite-plugin-svgr";
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), svgrPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": JSON.stringify(env)
    }
  };
});
