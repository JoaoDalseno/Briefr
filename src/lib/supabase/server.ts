// ⚠️  SERVER-SIDE ONLY — NUNCA importe este arquivo em Client Components.
// ⚠️  O service_role key (createAdminClient) BYPASSA TODAS as políticas de RLS.
// ⚠️  Use createAdminClient APENAS em API Routes para operações administrativas
//     onde você já validou a identidade e permissão do usuário manualmente.
// ⚠️  Para leitura comum em Server Components, prefira createServerClient
//     que usa a anon key e respeita RLS.

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client with anon key.
 * Respects Row Level Security — safe for Server Components and API Routes.
 *
 * Use in: Server Components, API Routes (leitura respeitando RLS)
 */
export function createServerClient() {
  const cookieStore = cookies()

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies will be set
            // by the middleware on the next request.
          }
        },
      },
    }
  )
}

/**
 * ⚠️  ADMIN CLIENT — bypassa RLS.
 * Usa a service_role key. Nunca exponha essa chave ao browser.
 *
 * Use APENAS em API Routes para operações que exigem acesso privilegiado:
 * - Criação de perfil após signup (trigger ou route handler)
 * - Webhook do Stripe atualizando subscriptions
 * - Scripts de manutenção/migração
 */
export function createAdminClient() {
  const cookieStore = cookies()

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component context — middleware handles cookie forwarding.
          }
        },
      },
    }
  )
}
