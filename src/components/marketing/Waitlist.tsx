'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { FadeUp } from '@/components/animations'

const PROFILES = [
  { id: 'gestor',     label: 'Gestor de tráfego' },
  { id: 'anunciante', label: 'Anunciante direto' },
  { id: 'agencia',    label: 'Agência / Freelancer' },
  { id: 'outro',      label: 'Outro' },
]

// ─── Counter ──────────────────────────────────────────────────────────────────

function WaitlistCounter() {
  const [count, setCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    fetch('/api/waitlist/count')
      .then(r => r.json())
      .then(({ count: n }: { count: number }) => setCount(n))
      .catch(() => null)
  }, [])

  if (count === null) return null

  if (count === 0) {
    return (
      <p className="text-sm text-[#6B6258]">Seja um dos primeiros.</p>
    )
  }

  if (count < 10) {
    return (
      <p className="text-sm text-[#6B6258]">Junte-se aos primeiros.</p>
    )
  }

  return (
    <p className="text-sm text-[#6B6258]">
      Junte-se a{' '}
      <span className="font-semibold text-[#C2410C]">{count.toLocaleString('pt-BR')}</span>
      {' '}pessoas na lista.
    </p>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function WaitlistForm() {
  const router = useRouter()
  const [name, setName]       = React.useState('')
  const [email, setEmail]     = React.useState('')
  const [profile, setProfile] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !profile) {
      toast.error('Preencha nome, email e perfil.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), profile }),
      })

      if (res.ok) {
        router.push('/obrigado')
      } else {
        const data = await res.json() as { error?: string }
        toast.error(data.error ?? 'Erro ao entrar na lista. Tente novamente.')
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = [
    'w-full rounded-xl border border-[#E8DCC4] bg-white px-4 py-3 text-sm text-[#1F1A14]',
    'placeholder:text-[#9A9080] transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-[#C2410C]/30 focus:border-[#C2410C]/60',
  ].join(' ')

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Name + Email side by side on desktop */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="wl-name" className="text-xs font-semibold text-[#6B6258] uppercase tracking-wider">
            Nome <span aria-hidden className="text-[#C2410C]">*</span>
          </label>
          <input
            id="wl-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Seu nome"
            className={inputCls}
            style={{ fontSize: 16 }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="wl-email" className="text-xs font-semibold text-[#6B6258] uppercase tracking-wider">
            Email <span aria-hidden className="text-[#C2410C]">*</span>
          </label>
          <input
            id="wl-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className={inputCls}
            style={{ fontSize: 16 }}
          />
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold text-[#6B6258] uppercase tracking-wider">
          Perfil <span aria-hidden className="text-[#C2410C]">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROFILES.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProfile(p.id)}
              aria-pressed={profile === p.id}
              className={cn(
                'rounded-xl border-2 px-3 py-2.5 text-sm font-medium text-center transition-all duration-150',
                profile === p.id
                  ? 'border-[#C2410C] bg-[#C2410C]/8 text-[#9A3309]'
                  : 'border-[#E8DCC4] bg-white text-[#6B6258] hover:border-[#C2410C]/40 hover:text-[#1F1A14]'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#C2410C] text-white font-semibold py-3.5 text-base transition-all duration-150 hover:bg-[#9A3309] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Registrando...' : 'Garantir minha vaga →'}
      </button>

      <p className="text-center text-xs text-[#9A9080]">
        Sem spam · Apenas um email quando liberar seu acesso
      </p>
    </form>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Waitlist() {
  return (
    <section id="waitlist" className="py-24 bg-[#FAF6EE]">
      <Container size="narrow">
        <FadeUp className="text-center mb-10">
          <p className="text-[13px] font-medium text-[#9A9080] uppercase tracking-[0.08em] mb-4">
            — Acesso antecipado
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F1A14] leading-tight">
            Entre antes de todo mundo.
          </h2>
          <p className="mt-3 text-base text-[#6B6258] max-w-md mx-auto leading-relaxed">
            O Briefr está em beta fechado. Cadastre-se agora e receba seu acesso
            assim que abrirmos novas vagas.
          </p>
          <div className="mt-3">
            <React.Suspense fallback={null}>
              <WaitlistCounter />
            </React.Suspense>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="rounded-2xl border border-[#E8DCC4] bg-white p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <WaitlistForm />
          </div>
        </FadeUp>
      </Container>
    </section>
  )
}
