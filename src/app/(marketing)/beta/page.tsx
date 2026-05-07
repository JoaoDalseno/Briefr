import type { Metadata } from 'next'
import { BetaForm } from '@/components/marketing/BetaForm'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Beta — Lista de espera',
  description: 'Entre na lista de espera do Briefr e seja um dos primeiros a usar IA para criar briefs de criativos no Brasil.',
}

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-background flex items-center py-20">
      <Container size="narrow">
        <div className="text-center mb-10">
          <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            Acesso antecipado
          </span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground tracking-tight text-balance">
            Entre na lista de espera
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-md mx-auto text-balance leading-relaxed">
            Estamos em beta fechado. Deixe seus dados e você receberá um código de acesso assim que abrirmos novas vagas.
          </p>
        </div>
        <BetaForm />
      </Container>
    </div>
  )
}
