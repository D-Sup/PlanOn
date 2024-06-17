import path from "path"
import react from "@vitejs/plugin-react"
import svgrPlugin from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(), svgrPlugin(),
        VitePWA({ 
          registerType: "autoUpdate",
          devOptions: {
            enabled: true,
          },
          includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
          manifest: {
            name: "플랜온",
            short_name: "플랜온",
            display: "standalone",
            theme_color: "#1A1A1A",
            icons: [
                {
                    src: "pwa-64x64.png",
                    sizes: "64x64",
                    type: "image/png"
                },
                {
                    src: "pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: "pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any"
                },
                {
                    src: "maskable-icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable"
                }
            ],
          }, 
        })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": JSON.stringify(env),
    }
  };
});
