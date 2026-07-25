import {
  createServerClient,
  parseCookieHeader,
} from "@supabase/ssr";
import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "astro:env/server";

import type { SupabaseSessionContext } from "./supabase-session/definitions";
import { toAstroCookieOptions } from "./supabase-session/utils";

export function hasSupabaseSessionConfiguration(): boolean {
  return (
    SUPABASE_URL !== undefined &&
    SUPABASE_PUBLISHABLE_KEY !== undefined
  );
}

export function createSupabaseSessionClient({
  cookies,
  request,
  responseHeaders,
}: SupabaseSessionContext) {
  if (
    SUPABASE_URL === undefined ||
    SUPABASE_PUBLISHABLE_KEY === undefined
  ) {
    throw new Error(
      "Faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY para gestionar sesiones.",
    );
  }

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("cookie") ?? "");
      },
      setAll(cookiesToSet, headers) {
        for (const { name, options, value } of cookiesToSet) {
          cookies.set(name, value, toAstroCookieOptions(options));
        }

        for (const [name, value] of Object.entries(headers)) {
          responseHeaders.set(name, value);
        }
      },
    },
  });
}
