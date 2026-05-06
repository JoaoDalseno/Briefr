import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'

const waitlistSchema = z.object({
  name:    z.string().min(2).max(100).transform(v => v.trim()),
  email:   z.string().email('Email inválido').max(254),
  profile: z.enum(['gestor', 'anunciante', 'agencia', 'outro']),
  volume:  z.string().optional(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const parsed = waitlistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()

  // Upsert: same email = update, not duplicate
  const { error } = await admin.from('waitlist').upsert(
    {
      name:    parsed.data.name,
      email:   parsed.data.email,
      profile: parsed.data.profile,
      volume:  parsed.data.volume ?? null,
    },
    { onConflict: 'email' }
  )

  if (error) {
    console.error('[waitlist] insert error:', error.message)
    return NextResponse.json({ error: 'Erro ao registrar. Tente novamente.' }, { status: 500 })
  }

  return NextResponse.json({ joined: true }, { status: 201 })
}
