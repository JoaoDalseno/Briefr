import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

const feedbackSchema = z.object({
  type: z.enum(['bug', 'sugestao', 'elogio']),
  text: z.string().min(5).max(1000).transform(v => v.trim()),
})

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const parsed = feedbackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const { error } = await admin.from('feedback').insert({
    user_id: user.id,
    type: parsed.data.type,
    text: parsed.data.text,
  })

  if (error) {
    console.error('[feedback] insert error:', error.message)
    return NextResponse.json({ error: 'Erro ao salvar. Tente novamente.' }, { status: 500 })
  }

  return NextResponse.json({ sent: true }, { status: 201 })
}
