import { createBrowserClient } from '@supabase/ssr'

// Browser client — safe to import in Client Components.
// For the server client, import from @/lib/supabase-server instead.

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
