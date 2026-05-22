import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a mock client that returns null user when Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
          }),
        }),
        update: () => ({
          eq: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        }),
      }),
    } as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
