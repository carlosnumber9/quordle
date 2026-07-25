import type { APIContext } from "astro";

export type SupabaseSessionContext = Pick<
  APIContext,
  "cookies" | "request"
> & {
  responseHeaders: Headers;
};
