import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { BriefView } from '@/components/app/BriefView'
import type { BriefOutput, BriefFormInput } from '@/lib/validations/brief'

export async function generateMetadata() {
  return { title: 'Brief' }
}

export default async function BriefPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) redirect('/login')

  const { data: brief, error: fetchError } = await supabase
    .from('briefs')
    .select('id, form_data, generated_content, formats, created_at, public_share_token')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !brief) notFound()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single()

  return (
    <BriefView
      brief={{
        id: brief.id,
        formData: brief.form_data as BriefFormInput,
        content: brief.generated_content as BriefOutput,
        formats: brief.formats as string[],
        createdAt: brief.created_at,
        shareToken: brief.public_share_token as string | null,
      }}
      plan={subscription?.plan ?? 'free'}
    />
  )
}
