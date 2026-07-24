import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  if (import.meta.env.DEV) {
    return next();
  }

  const {
    createSupabaseSessionClient,
    hasSupabaseSessionConfiguration,
  } = await import("./services/supabase-session.server");

  if (!hasSupabaseSessionConfiguration()) {
    return next();
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseSessionClient({
    cookies: context.cookies,
    request: context.request,
    responseHeaders,
  });

  await supabase.auth.getClaims();

  const response = await next();
  responseHeaders.forEach((value, name) => {
    response.headers.set(name, value);
  });

  return response;
});
