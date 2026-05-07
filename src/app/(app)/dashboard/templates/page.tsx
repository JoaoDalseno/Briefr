import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock, Zap } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Templates' }

export default async function TemplatesPage() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single()

  const plan = subscription?.plan ?? 'free'
  const isPro = plan !== 'free'

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-foreground">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Briefs pré-configurados para os segmentos mais comuns do mercado brasileiro.
        </p>
      </div>

      {!isPro ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-primary/4 py-20 px-8 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="size-8 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-xl text-foreground">Templates exclusivos Pro</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Acesse mais de 20 templates otimizados para e-commerce, infoprodutos, clínicas, imobiliárias e muito mais.
          </p>
          <Link
            href="/dashboard/settings"
            className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}
          >
            <Zap className="size-4" />
            Fazer upgrade para Pro
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card p-8 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/8 mx-auto">
            <Zap className="size-8 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-xl text-foreground">Em breve</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Os templates estão sendo preparados. Você será notificado por email assim que estiverem disponíveis.
          </p>
          <Link
            href="/dashboard/new-brief"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'mt-6')}
          >
            Criar brief personalizado
          </Link>
        </div>
      )}
    </div>
  )
}
