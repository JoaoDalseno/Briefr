import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  // Verify ownership
  const { data: brief, error } = await supabase
    .from('briefs')
    .select('id, public_share_token')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !brief) {
    return NextResponse.json({ error: 'Brief não encontrado.' }, { status: 404 })
  }

  // If already has a token, return it
  if (brief.public_share_token) {
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${brief.public_share_token}`
    return NextResponse.json({ token: brief.public_share_token, url: shareUrl })
  }

  // Generate new token
  const token = crypto.randomUUID()
  const admin = createAdminClient()

  const { error: updateError } = await admin
    .from('briefs')
    .update({ public_share_token: token })
    .eq('id', params.id)

  if (updateError) {
    return NextResponse.json({ error: 'Erro ao gerar link.' }, { status: 500 })
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${token}`
  return NextResponse.json({ token, url: shareUrl }, { status: 201 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('briefs')
    .update({ public_share_token: null })
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Erro ao revogar link.' }, { status: 500 })
  }

  return NextResponse.json({ revoked: true })
}
