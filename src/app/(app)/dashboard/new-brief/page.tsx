'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { BriefGenerationLoader } from '@/components/app/BriefGenerationLoader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const FORMATS = [
  { value: 'estatico', label: 'Estático', desc: 'Imagem, banner ou carrossel' },
  { value: 'story',    label: 'Story',    desc: 'Vídeo ou estático vertical 9:16' },
  { value: 'ugc',      label: 'Vídeo UGC', desc: 'Roteiro para criador de conteúdo' },
] as const

const OBJECTIVES = [
  { value: 'vendas',       label: 'Vendas' },
  { value: 'leads',        label: 'Geração de leads' },
  { value: 'awareness',    label: 'Awareness' },
  { value: 'consideracao', label: 'Consideração' },
] as const

const TONES = [
  { value: 'profissional', label: 'Profissional' },
  { value: 'descontraido', label: 'Descontraído' },
  { value: 'urgente',      label: 'Urgente' },
  { value: 'inspirador',   label: 'Inspirador' },
  { value: 'educativo',    label: 'Educativo' },
] as const

// ─── Field components ─────────────────────────────────────────────────────────

function FieldGroup({ label, htmlFor, error, children }: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function PillGroup<T extends string>({
  options,
  selected,
  onChange,
  multi = false,
}: {
  options: readonly { value: T; label: string; desc?: string }[]
  selected: T[]
  onChange: (v: T[]) => void
  multi?: boolean
}) {
  function toggle(value: T) {
    if (multi) {
      onChange(
        selected.includes(value)
          ? selected.filter(v => v !== value)
          : [...selected, value]
      )
    } else {
      onChange([value])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              'flex flex-col rounded-xl border px-4 py-2.5 text-left text-sm transition-all',
              active
                ? 'border-primary bg-primary/8 text-primary font-semibold shadow-sm'
                : 'border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            <span className="font-medium">{opt.label}</span>
            {opt.desc && (
              <span className={cn('text-xs mt-0.5', active ? 'text-primary/70' : 'text-muted-foreground')}>
                {opt.desc}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function NewBriefPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pre-select format from URL param
  const urlFormat = searchParams.get('format')
  const validFormats = FORMATS.map(f => f.value) as string[]
  const preSelected = urlFormat && validFormats.includes(urlFormat) ? [urlFormat as 'estatico' | 'story' | 'ugc'] : []

  const [productName,       setProductName]       = React.useState('')
  const [targetAudience,    setTargetAudience]    = React.useState('')
  const [objective,         setObjective]         = React.useState<string[]>([])
  const [usp,               setUsp]               = React.useState('')
  const [tone,              setTone]              = React.useState<string[]>([])
  const [formats,           setFormats]           = React.useState<('estatico' | 'story' | 'ugc')[]>(preSelected)
  const [additionalContext, setAdditionalContext] = React.useState('')
  const [errors,            setErrors]            = React.useState<Record<string, string>>({})
  const [generating,        setGenerating]        = React.useState(false)

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (productName.trim().length < 2)   e.productName    = 'Mínimo 2 caracteres.'
    if (targetAudience.trim().length < 10) e.targetAudience = 'Descreva com ao menos 10 caracteres.'
    if (objective.length === 0)           e.objective      = 'Selecione um objetivo.'
    if (usp.trim().length < 10)          e.usp            = 'Descreva com ao menos 10 caracteres.'
    if (tone.length === 0)               e.tone           = 'Selecione um tom.'
    if (formats.length === 0)            e.formats        = 'Selecione ao menos um formato.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setGenerating(true)
    try {
      const res = await fetch('/api/briefs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name:       productName.trim(),
          target_audience:    targetAudience.trim(),
          objective:          objective[0],
          unique_selling_point: usp.trim(),
          tone:               tone[0],
          formats,
          additional_context: additionalContext.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Erro ao gerar o brief. Tente novamente.')
        setGenerating(false)
        return
      }

      router.push(`/briefs/${data.id}`)
    } catch {
      toast.error('Erro de conexão. Verifique sua internet e tente novamente.')
      setGenerating(false)
    }
  }

  if (generating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <BriefGenerationLoader />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif font-normal text-3xl text-foreground tracking-[-0.02em]">Novo brief</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Preencha os dados do seu produto e a IA gera um brief completo em ~20 segundos.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Card: Produto */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col gap-5">
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Sobre o produto
          </h2>

          <FieldGroup label="Nome do produto ou serviço *" htmlFor="product-name" error={errors.productName}>
            <Input
              id="product-name"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="Ex: Curso de Tráfego Pago, Creatina Pro, Consultoria Financeira"
              maxLength={200}
              aria-required="true"
            />
          </FieldGroup>

          <FieldGroup label="Público-alvo *" htmlFor="target-audience" error={errors.targetAudience}>
            <textarea
              id="target-audience"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="Ex: Empreendedores iniciantes entre 25 e 40 anos que querem aprender a escalar anúncios no Meta Ads"
              maxLength={500}
              rows={3}
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              aria-required="true"
            />
          </FieldGroup>

          <FieldGroup label="Principal diferencial / oferta *" htmlFor="usp" error={errors.usp}>
            <textarea
              id="usp"
              value={usp}
              onChange={e => setUsp(e.target.value)}
              placeholder="Ex: Método exclusivo com garantia de 30 dias, aprovado por +5000 alunos"
              maxLength={500}
              rows={2}
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              aria-required="true"
            />
          </FieldGroup>
        </div>

        {/* Card: Configurações */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col gap-5">
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Configurações do brief
          </h2>

          <FieldGroup label="Objetivo do anúncio *" htmlFor="objective" error={errors.objective}>
            <div id="objective">
              <PillGroup
                options={OBJECTIVES}
                selected={objective}
                onChange={setObjective}
              />
            </div>
          </FieldGroup>

          <FieldGroup label="Tom da comunicação *" htmlFor="tone" error={errors.tone}>
            <div id="tone">
              <PillGroup
                options={TONES}
                selected={tone}
                onChange={setTone}
              />
            </div>
          </FieldGroup>

          <FieldGroup label="Formatos do brief *" htmlFor="formats" error={errors.formats}>
            <div id="formats">
              <PillGroup
                options={FORMATS}
                selected={formats}
                onChange={v => setFormats(v as ('estatico' | 'story' | 'ugc')[])}
                multi
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Selecione um ou mais formatos.</p>
          </FieldGroup>
        </div>

        {/* Card: Contexto adicional */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col gap-3">
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Contexto adicional <span className="normal-case font-normal">(opcional)</span>
          </h2>
          <textarea
            id="additional-context"
            value={additionalContext}
            onChange={e => setAdditionalContext(e.target.value)}
            placeholder="Informações extras: promoção ativa, sazonalidade, restrições de linguagem, referências de briefs anteriores..."
            maxLength={1000}
            rows={3}
            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {additionalContext.length}/1000
          </p>
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full font-serif font-normal italic" disabled={generating}>
          Gerar brief com IA →
        </Button>
      </form>
    </div>
  )
}
