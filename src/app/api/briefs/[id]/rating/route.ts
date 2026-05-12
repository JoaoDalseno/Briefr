import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

const ratingSchema = z.object({
  rating:  z.number().int().min(1).max(5),
  comment: z.string().max(500).transform((v) => v.trim()).optional(),
})

// ─── GET — fetch current user's rating for this brief ────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const { data } = await supabase
    .from('brief_ratings')
    .select('rating, comment, created_at, updated_at')
    .eq('brief_id', params.id)
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ rating: data ?? null })
}

// ─── POST — upsert rating (create or update) ──────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const parsed = ratingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
      { status: 400 }
    )
  }

  // Confirm the brief belongs to this user before rating
  const { data: brief } = await supabase
    .from('briefs')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!brief) {
    return NextResponse.json({ error: 'Brief não encontrado.' }, { status: 404 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('brief_ratings')
    .upsert(
      {
        brief_id:   params.id,
        user_id:    user.id,
        rating:     parsed.data.rating,
        comment:    parsed.data.comment ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'brief_id,user_id' }
    )
    .select('rating, comment, updated_at')
    .single()

  if (error) {
    console.error('[brief_ratings] upsert error:', error.message)
    return NextResponse.json({ error: 'Erro ao salvar. Tente novamente.' }, { status: 500 })
  }

  return NextResponse.json({ rating: data }, { status: 200 })
}

// ─── DELETE — remove rating ───────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  await supabase
    .from('brief_ratings')
    .delete()
    .eq('brief_id', params.id)
    .eq('user_id', user.id)

  return NextResponse.json({ deleted: true })
}
