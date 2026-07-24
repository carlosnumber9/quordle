import {
  createServerClient,
  parseCookieHeader,
  type CookieOptions,
} from "@supabase/ssr";
import type { APIContext, AstroCookieSetOptions } from "astro";
import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "astro:env/server";

type SupabaseSessionContext = Pick<APIContext, "cookies" | "request"> & {
  responseHeaders: Headers;
};

function toAstroCookieOptions(
  options: CookieOptions,
): AstroCookieSetOptions {
  const {
    domain,
    encode,
    expires,
    httpOnly,
    maxAge,
    partitioned,
    path,
    sameSite,
    secure,
  } = options;

  return {
    ...(domain === undefined ? {} : { domain }),
    ...(encode === undefined ? {} : { encode }),
    ...(expires === undefined ? {} : { expires }),
    ...(httpOnly === undefined ? {} : { httpOnly }),
    ...(maxAge === undefined ? {} : { maxAge }),
    ...(partitioned === undefined ? {} : { partitioned }),
    ...(path === undefined ? {} : { path }),
    ...(sameSite === undefined ? {} : { sameSite }),
    ...(secure === undefined ? {} : { secure }),
  };
}

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
