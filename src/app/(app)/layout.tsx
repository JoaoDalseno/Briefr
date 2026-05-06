import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/app/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single()

  const plan = subscription?.plan ?? 'free'
  const userName = user.user_metadata?.full_name as string | undefined
  const userEmail = user.email

  return (
    <AppShell plan={plan} userName={userName} userEmail={userEmail}>
      {children}
    </AppShell>
  )
}
