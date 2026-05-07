import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const admin = createAdminClient()

  const { count, error } = await admin
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('[waitlist/count] error:', error.message)
    return NextResponse.json({ count: 0 })
  }

  return NextResponse.json({ count: count ?? 0 })
}
