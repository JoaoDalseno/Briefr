'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PROFILES = [
  { id: 'gestor', label: 'Gestor de tráfego' },
  { id: 'anunciante', label: 'Anunciante direto' },
  { id: 'agencia', label: 'Agência / Freelancer' },
  { id: 'outro', label: 'Outro' },
]

const VOLUMES = [
  { id: 'menos10', label: 'Menos de 10 campanhas/mês' },
  { id: '10a30', label: '10 a 30 campanhas/mês' },
  { id: '30mais', label: 'Mais de 30 campanhas/mês' },
]

export function BetaForm() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [profile, setProfile] = React.useState('')
  const [volume, setVolume] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)

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
        body: JSON.stringify({ name: name.trim(), email: email.trim(), profile, volume }),
      })
      if (res.ok) {
        setDone(true)
        toast.success('Você está na lista! 🎉')
      } else {
        const { error } = await res.json()
        toast.error(error ?? 'Erro ao entrar na lista. Tente novamente.')
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-white p-10 shadow-card text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Você está na lista!</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Vamos avisar você por email assim que liberar novos acessos. Fique de olho na caixa de entrada!
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-white p-8 shadow-card flex flex-col gap-5"
      noValidate
    >
      {/* Nome */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="beta-name" className="text-sm font-semibold text-foreground">
          Nome <span aria-hidden className="text-destructive">*</span>
        </label>
        <input
          id="beta-name"
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Seu nome"
          className="rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/40 transition-colors"
          style={{ fontSize: 16 }}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="beta-email" className="text-sm font-semibold text-foreground">
          Email <span aria-hidden className="text-destructive">*</span>
        </label>
        <input
          id="beta-email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/40 transition-colors"
          style={{ fontSize: 16 }}
        />
      </div>

      {/* Perfil */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-2">
          Perfil <span aria-hidden className="text-destructive">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {PROFILES.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProfile(p.id)}
              aria-pressed={profile === p.id}
              className={cn(
                'rounded-lg border-2 px-3 py-2.5 text-sm font-medium text-left transition-all',
                profile === p.id
                  ? 'border-primary bg-primary/8 text-primary'
                  : 'border-border bg-white text-foreground hover:border-primary/40'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Volume */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-2">Volume mensal (opcional)</legend>
        <div className="flex flex-col gap-2">
          {VOLUMES.map(v => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVolume(v.id)}
              aria-pressed={volume === v.id}
              className={cn(
                'rounded-lg border-2 px-3 py-2.5 text-sm font-medium text-left transition-all',
                volume === v.id
                  ? 'border-primary bg-primary/8 text-primary'
                  : 'border-border bg-white text-foreground hover:border-primary/40'
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="w-full mt-2" disabled={loading} aria-busy={loading}>
        {loading ? 'Entrando na lista...' : 'Quero acesso antecipado →'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Sem spam. Apenas um email quando liberar seu acesso.
      </p>
    </form>
  )
}
