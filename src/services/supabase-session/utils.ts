import type { CookieOptions } from "@supabase/ssr";
import type { AstroCookieSetOptions } from "astro";

export function toAstroCookieOptions(
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
