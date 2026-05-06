import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Supabase Auth callback handler.
 * Supabase redirects here after:
 *   - Email confirmation (signup)
 *   - Password recovery (forgot-password)
 *   - OAuth (if configured later)
 *
 * It exchanges the `code` query param for a valid session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Reject malformed callback requests
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  // Prevent open redirect: only allow relative paths
  const safePath = next.startsWith('/') ? next : '/dashboard'

  const supabase = createServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message)
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
  }

  return NextResponse.redirect(`${origin}${safePath}`)
}
