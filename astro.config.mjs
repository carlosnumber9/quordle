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
  },
  env: {
    schema: {
      SUPABASE_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SUPABASE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SUPABASE_PUBLISHABLE_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CRON_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PUBLIC_SITE_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
});
