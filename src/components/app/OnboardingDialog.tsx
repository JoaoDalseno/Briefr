'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { X, ArrowRight, ArrowLeft, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingDialogProps {
  /** Called when user completes or skips onboarding */
  onDone: () => void
}

const NICHES = [
  { id: 'ecommerce',    label: 'E-commerce',         emoji: '🛍️' },
  { id: 'infoproduto',  label: 'Infoproduto',         emoji: '📚' },
  { id: 'servicos',     label: 'Serviços locais',     emoji: '🏪' },
  { id: 'agencia',      label: 'Agência / Freelancer', emoji: '🎯' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingDialog({ onDone }: OnboardingDialogProps) {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [niche, setNiche] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  async function handleFinish() {
    if (!niche) { onDone(); return }

    setSaving(true)
    try {
      await fetch('/api/profile/niche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      })
    } catch {
      // Non-critical — proceed regardless
    } finally {
      setSaving(false)
      onDone()
    }
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bem-vindo ao Briefr"
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Skip */}
        <button
          type="button"
          onClick={onDone}
          className="absolute top-4 right-4 flex items-center justify-center size-7 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Pular"
        >
          <X className="size-4" />
        </button>

        <div className="p-8">
          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <Zap className="size-7 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl text-foreground">
                  Bem-vindo ao Briefr!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Vamos criar seu primeiro brief em menos de 2 minutos. Mas antes, deixa a gente conhecer seu negócio.
                </p>
              </div>
              <Button size="lg" className="mt-2 w-full" onClick={() => setStep(2)}>
                Vamos lá <ArrowRight className="size-4" />
              </Button>
              <button
                type="button"
                onClick={onDone}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Pular por enquanto
              </button>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">
                  Qual é o seu nicho principal?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Isso ajuda a IA a personalizar os briefs para o seu mercado.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {NICHES.map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNiche(n.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all',
                      niche === n.id
                        ? 'border-primary bg-primary/8 text-primary'
                        : 'border-border bg-white text-foreground hover:border-primary/40 hover:bg-primary/4'
                    )}
                  >
                    <span className="text-2xl">{n.emoji}</span>
                    {n.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  <ArrowLeft className="size-4" /> Voltar
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!niche}
                  onClick={() => setStep(3)}
                >
                  Continuar <ArrowRight className="size-4" />
                </Button>
              </div>
              <button
                type="button"
                onClick={onDone}
                className="text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Pular
              </button>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="flex flex-col gap-5 text-center">
              <div className="mx-auto text-5xl">🎉</div>
              <div>
                <h2 className="font-heading font-bold text-2xl text-foreground">Tudo pronto!</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Você tem 3 briefs gratuitos para usar. Clique em{' '}
                  <strong className="text-foreground">Novo Brief</strong> para começar agora.
                </p>
              </div>

              <div className="rounded-xl bg-muted p-4 text-left text-xs text-muted-foreground leading-relaxed">
                💡 <strong className="text-foreground">Dica:</strong> Quanto mais detalhes você preencher
                no formulário, mais preciso e pronto-para-usar será o brief gerado.
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={saving}
                onClick={handleFinish}
              >
                {saving ? 'Salvando...' : 'Criar meu primeiro brief →'}
              </Button>

              <button
                type="button"
                onClick={() => { handleFinish(); router.push('/dashboard') }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver o dashboard primeiro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Hook para controle de onboarding ────────────────────────────────────────

export function useOnboarding(onboardingDone?: boolean) {
  // onboardingDone = true if user_metadata.onboarding_complete === true
  const [show, setShow] = React.useState(!onboardingDone)
  return { show, dismiss: () => setShow(false) }
}
