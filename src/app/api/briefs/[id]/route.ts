import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

// PATCH — update product name (inline edit)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  let body: { product_name?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  if (!body.product_name || typeof body.product_name !== 'string') {
    return NextResponse.json({ error: 'Nome inválido.' }, { status: 400 })
  }

  const name = body.product_name.trim().slice(0, 200)
  if (name.length < 2) {
    return NextResponse.json({ error: 'Nome muito curto.' }, { status: 400 })
  }

  // Fetch current form_data, patch product_name, write back
  const admin = createAdminClient()
  const { data: brief } = await admin
    .from('briefs')
    .select('form_data')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!brief) {
    return NextResponse.json({ error: 'Brief não encontrado.' }, { status: 404 })
  }

  const newFormData = { ...(brief.form_data as object), product_name: name }
  const { error: updateError } = await admin
    .from('briefs')
    .update({ form_data: newFormData })
    .eq('id', params.id)

  if (updateError) {
    return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 })
  }

  return NextResponse.json({ updated: true })
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  // Verify ownership before delete
  const { data: brief } = await supabase
    .from('briefs')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!brief) {
    return NextResponse.json({ error: 'Brief não encontrado.' }, { status: 404 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('briefs').delete().eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Erro ao excluir.' }, { status: 500 })
  }

  return NextResponse.json({ deleted: true })
}
