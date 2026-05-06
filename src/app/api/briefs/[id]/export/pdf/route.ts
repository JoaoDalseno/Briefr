export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { BriefPDF } from '@/components/pdf/BriefPDF'
import type { BriefOutput, BriefFormInput } from '@/lib/validations/brief'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const { data: brief, error } = await supabase
    .from('briefs')
    .select('id, form_data, generated_content, created_at')
    .eq('id', params.id)
    .eq('user_id', user.id)  // RLS: apenas o próprio dono
    .single()

  if (error || !brief) {
    return NextResponse.json({ error: 'Brief não encontrado.' }, { status: 404 })
  }

  const formData = brief.form_data as BriefFormInput
  const content  = brief.generated_content as BriefOutput
  const productName = formData.product_name ?? 'Brief'

  // Cast required: renderToBuffer expects ReactElement<DocumentProps> but TypeScript
  // infers FunctionComponentElement<BriefPDFProps>. Safe — BriefPDF renders a Document.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const pdfElement = React.createElement(BriefPDF, {
    productName, formData, content, createdAt: brief.created_at,
  }) as any
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const buffer = await renderToBuffer(pdfElement)

  const filename = `brief-${productName.toLowerCase().replace(/\s+/g, '-').slice(0, 40)}.pdf`

  // renderToBuffer returns a Node.js Buffer; convert to Uint8Array for NextResponse
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control':       'private, no-store',
    },
  })
}
