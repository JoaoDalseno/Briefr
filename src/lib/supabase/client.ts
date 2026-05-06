import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client.
 * Uses the public anon key — safe to expose in the client.
 * Subject to Row Level Security policies.
 *
 * Use in: Client Components ('use client')
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
