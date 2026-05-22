import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Return null when Supabase is not configured
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return supabaseInstance;
}

// Export the client as 'supabase' for backward compatibility
// This may be null if Supabase is not configured
export const supabase = createClient();
