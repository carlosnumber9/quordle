import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_SECRET_KEY, SUPABASE_URL } from "astro:env/server";

import { MissingServerConfigurationError } from "./supabase/definitions";

export { MissingServerConfigurationError } from "./supabase/definitions";

let client: SupabaseClient | undefined;

export function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = SUPABASE_URL;
  const supabaseSecretKey = SUPABASE_SECRET_KEY;
  const missing = [
    supabaseUrl === undefined ? "SUPABASE_URL" : null,
    supabaseSecretKey === undefined ? "SUPABASE_SECRET_KEY" : null,
  ].filter((name): name is string => name !== null);

  if (
    missing.length > 0 ||
    supabaseUrl === undefined ||
    supabaseSecretKey === undefined
  ) {
    throw new MissingServerConfigurationError(missing);
  }

  client ??= createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return client;
}
