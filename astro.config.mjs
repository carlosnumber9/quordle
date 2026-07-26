import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["gsap"],
    },
  },
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
});
