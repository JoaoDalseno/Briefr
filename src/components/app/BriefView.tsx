'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy, Check, Download, Link2, Trash2, Edit2,
  ChevronDown, FileText, Share2,
  ExternalLink, X, AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BriefOutput, BriefFormInput } from '@/lib/validations/brief'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BriefData {
  id: string
  formData: BriefFormInput
  content: BriefOutput
  formats: string[]
  createdAt: string
  shareToken: string | null
}

interface BriefViewProps {
  brief: BriefData
  plan: string
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copiado!')
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
    >
      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
      {copied ? 'Copiado' : label}
    </button>
  )
}

// ─── Content block ────────────────────────────────────────────────────────────

function ContentBlock({
  label,
  children,
  copyText,
  delay = 0,
}: {
  label: string
  children: React.ReactNode
  copyText?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </motion.div>
  )
}

// ─── Format tab content ───────────────────────────────────────────────────────

function EstaticoContent({ data }: { data: NonNullable<BriefOutput['estatico']> }) {
  return (
    <div className="flex flex-col gap-4">
      <ContentBlock label="Headline" copyText={data.headline} delay={0}>
        <p className="text-sm font-semibold text-foreground leading-relaxed">{data.headline}</p>
      </ContentBlock>
      <ContentBlock label="Copy do anúncio" copyText={data.body} delay={0.05}>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{data.body}</p>
      </ContentBlock>
      <ContentBlock label="CTA sugerido" copyText={data.cta} delay={0.1}>
        <span className="inline-flex items-center rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary">
          {data.cta}
        </span>
      </ContentBlock>
      <ContentBlock label="Sugestão visual" copyText={data.visual_suggestion} delay={0.15}>
        <p className="text-sm text-foreground leading-relaxed">{data.visual_suggestion}</p>
      </ContentBlock>
    </div>
  )
}

function StoryContent({ data }: { data: NonNullable<BriefOutput['story']> }) {
  return (
    <div className="flex flex-col gap-4">
      <ContentBlock label="Hook de abertura" copyText={data.hook} delay={0}>
        <p className="text-sm font-semibold text-foreground leading-relaxed">{data.hook}</p>
      </ContentBlock>
      <ContentBlock label="Desenvolvimento" copyText={data.middle} delay={0.05}>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{data.middle}</p>
      </ContentBlock>
      <ContentBlock label="CTA final" copyText={data.cta} delay={0.1}>
        <span className="inline-flex items-center rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary">
          {data.cta}
        </span>
      </ContentBlock>
      <ContentBlock label="Duração sugerida" delay={0.15}>
        <p className="text-sm text-foreground">{data.duration}</p>
      </ContentBlock>
    </div>
  )
}

function UgcContent({ data }: { data: NonNullable<BriefOutput['ugc']> }) {
  return (
    <div className="flex flex-col gap-4">
      <ContentBlock label="Roteiro de abertura (hook)" copyText={data.hook_script} delay={0}>
        <p className="text-sm font-semibold text-foreground leading-relaxed">{data.hook_script}</p>
      </ContentBlock>
      <ContentBlock label="Pontos de conversa" copyText={data.talking_points.join('\n')} delay={0.05}>
        <ul className="flex flex-col gap-2">
          {data.talking_points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {pt}
            </li>
          ))}
        </ul>
      </ContentBlock>
      <ContentBlock label="CTA sugerido" copyText={data.cta} delay={0.1}>
        <span className="inline-flex items-center rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary">
          {data.cta}
        </span>
      </ContentBlock>
      <ContentBlock label="Tom e estilo" copyText={data.tone_notes} delay={0.15}>
        <p className="text-sm text-foreground leading-relaxed">{data.tone_notes}</p>
      </ContentBlock>
    </div>
  )
}

// ─── Export dropdown ──────────────────────────────────────────────────────────

function buildMarkdown(brief: BriefData): string {
  const { formData, content } = brief
  let md = `# Brief — ${formData.product_name}\n\n`
  md += `**Objetivo:** ${formData.objective} · **Tom:** ${formData.tone}\n\n`
  if (content.estatico) {
    md += `## Anúncio Estático\n\n**Headline:** ${content.estatico.headline}\n\n**Copy:** ${content.estatico.body}\n\n**CTA:** ${content.estatico.cta}\n\n**Visual:** ${content.estatico.visual_suggestion}\n\n`
  }
  if (content.story) {
    md += `## Story\n\n**Hook:** ${content.story.hook}\n\n**Desenvolvimento:** ${content.story.middle}\n\n**CTA:** ${content.story.cta}\n\n**Duração:** ${content.story.duration}\n\n`
  }
  if (content.ugc) {
    md += `## Vídeo UGC\n\n**Hook/Roteiro:** ${content.ugc.hook_script}\n\n**Pontos de conversa:**\n${content.ugc.talking_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n**CTA:** ${content.ugc.cta}\n\n**Tom:** ${content.ugc.tone_notes}\n\n`
  }
  return md
}

function ExportDropdown({ brief, isPro }: { brief: BriefData; isPro: boolean }) {
  const [open, setOpen] = React.useState(false)
  const [pdfLoading, setPdfLoading] = React.useState(false)
  const [shareLoading, setShareLoading] = React.useState(false)

  async function downloadPdf() {
    if (!isPro) { toast.error('Exportação PDF disponível no plano Pro.'); return }
    setPdfLoading(true)
    setOpen(false)
    try {
      const res = await fetch(`/api/briefs/${brief.id}/export/pdf`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `brief-${brief.formData.product_name.toLowerCase().replace(/\s+/g, '-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF baixado!')
    } catch {
      toast.error('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setPdfLoading(false)
    }
  }

  function copyMarkdown() {
    navigator.clipboard.writeText(buildMarkdown(brief))
    toast.success('Markdown copiado!')
    setOpen(false)
  }

  function copyNotion() {
    // Notion-compatible: same as markdown but Notion parses it natively
    navigator.clipboard.writeText(buildMarkdown(brief))
    toast.success('Copiado no formato Notion!')
    setOpen(false)
  }

  async function generateShareLink() {
    setShareLoading(true)
    setOpen(false)
    try {
      const res = await fetch(`/api/briefs/${brief.id}/share`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado! Qualquer pessoa com o link pode visualizar.')
    } catch {
      toast.error('Erro ao gerar link.')
    } finally {
      setShareLoading(false)
    }
  }

  return (
    <div className="relative">
      <Button
        size="default"
        variant="default"
        onClick={() => setOpen(v => !v)}
        disabled={pdfLoading || shareLoading}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Download className="size-4" />
        {pdfLoading ? 'Gerando PDF...' : shareLoading ? 'Gerando link...' : 'Exportar'}
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-2 z-40 w-56 rounded-xl border border-border bg-card shadow-card py-1 overflow-hidden">
            <button
              type="button"
              onClick={downloadPdf}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <FileText className="size-4 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">PDF formatado</p>
                <p className="text-xs text-muted-foreground">{isPro ? 'Download imediato' : 'Plano Pro'}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={copyMarkdown}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Copy className="size-4 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Markdown</p>
                <p className="text-xs text-muted-foreground">Copia para o clipboard</p>
              </div>
            </button>
            <button
              type="button"
              onClick={copyNotion}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <ExternalLink className="size-4 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Notion-ready</p>
                <p className="text-xs text-muted-foreground">Cole direto no Notion</p>
              </div>
            </button>
            <div className="border-t border-border my-1" />
            <button
              type="button"
              onClick={generateShareLink}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Share2 className="size-4 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Link compartilhável</p>
                <p className="text-xs text-muted-foreground">Leitura pública sem login</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Delete confirmation dialog ───────────────────────────────────────────────

function DeleteDialog({ onConfirm, onCancel, loading }: { onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" aria-hidden />
          </div>
          <div>
            <h2 id="delete-title" className="font-semibold text-foreground">Excluir brief?</h2>
            <p id="delete-desc" className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Esta ação é irreversível. O brief será permanentemente removido e não poderá ser recuperado.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Inline edit title ────────────────────────────────────────────────────────

function InlineTitle({ value, briefId, onChange }: { value: string; briefId: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const [saving, setSaving] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  async function save() {
    if (draft.trim() === value || draft.trim().length < 2) { setEditing(false); setDraft(value); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/briefs/${briefId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: draft.trim() }),
      })
      if (res.ok) { onChange(draft.trim()); toast.success('Nome atualizado!') }
      else toast.error('Erro ao salvar nome.')
    } catch {
      toast.error('Erro ao salvar nome.')
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setEditing(false); setDraft(value) } }}
          className="flex-1 rounded-lg border border-primary/40 bg-white px-3 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          maxLength={200}
          aria-label="Nome do produto"
          disabled={saving}
        />
        <button type="button" onClick={save} disabled={saving} aria-label="Salvar nome" className="text-primary hover:text-primary/80">
          <Check className="size-4" />
        </button>
        <button type="button" onClick={() => { setEditing(false); setDraft(value) }} aria-label="Cancelar edição" className="text-muted-foreground">
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="group flex items-center gap-2 text-left"
      aria-label="Clique para editar o nome do produto"
      title="Clique para editar"
    >
      <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {value}
      </h1>
      <Edit2 className="size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const FORMAT_LABELS: Record<string, string> = {
  estatico: 'Estático',
  story:    'Story',
  ugc:      'Vídeo UGC',
}

export function BriefView({ brief, plan }: BriefViewProps) {
  const router = useRouter()
  const isPro = plan !== 'free'
  const [productName, setProductName] = React.useState(brief.formData.product_name)
  const [activeTab, setActiveTab] = React.useState(brief.formats[0] ?? 'estatico')
  const [showDelete, setShowDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const OBJECTIVE_LABELS: Record<string, string> = {
    vendas: 'Vendas',
    leads: 'Geração de leads',
    awareness: 'Awareness',
    consideracao: 'Consideração',
  }
  const TONE_LABELS: Record<string, string> = {
    profissional: 'Profissional',
    descontraido: 'Descontraído',
    urgente: 'Urgente',
    inspirador: 'Inspirador',
    educativo: 'Educativo',
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/briefs/${brief.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Brief excluído.')
        router.push('/dashboard')
      } else {
        toast.error('Erro ao excluir. Tente novamente.')
        setDeleting(false)
        setShowDelete(false)
      }
    } catch {
      toast.error('Erro ao excluir.')
      setDeleting(false)
      setShowDelete(false)
    }
  }

  const age = formatDistanceToNow(new Date(brief.createdAt), { addSuffix: true, locale: ptBR })

  return (
    <>
      {showDelete && (
        <DeleteDialog
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}

      {/* Page header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">← <button type="button" onClick={() => router.back()} className="hover:text-foreground transition-colors">Voltar</button></p>
          <InlineTitle value={productName} briefId={brief.id} onChange={setProductName} />
          <p className="text-xs text-muted-foreground mt-1">{age}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDelete(true)}
            aria-label="Excluir brief"
            title="Excluir brief"
          >
            <Trash2 className="size-4 text-destructive" aria-hidden />
            <span className="sr-only sm:not-sr-only">Excluir</span>
          </Button>
          <ExportDropdown brief={{ ...brief, formData: { ...brief.formData, product_name: productName } }} isPro={isPro} />
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Left: Metadata */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Detalhes</h2>
            <dl className="flex flex-col gap-3">
              {/* eslint-disable security/detect-object-injection */}
              {[
                { label: 'Objetivo', value: OBJECTIVE_LABELS[brief.formData.objective] ?? brief.formData.objective },
                { label: 'Tom', value: TONE_LABELS[brief.formData.tone] ?? brief.formData.tone },
                { label: 'Formatos', value: brief.formats.map(f => FORMAT_LABELS[f] ?? f).join(', ') },
                { label: 'Público', value: brief.formData.target_audience },
                { label: 'Diferencial', value: brief.formData.unique_selling_point },
              /* eslint-enable security/detect-object-injection */
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</dt>
                  <dd className="text-sm text-foreground leading-snug">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {brief.shareToken && (
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="size-3.5 text-primary" aria-hidden />
                <span className="text-xs font-semibold text-foreground">Link público ativo</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-snug">
                Qualquer pessoa com o link pode visualizar este brief.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const url = `${window.location.origin}/shared/${brief.shareToken}`
                  await navigator.clipboard.writeText(url)
                  toast.success('Link copiado!')
                }}
                className="text-xs text-primary hover:underline font-medium"
              >
                Copiar link
              </button>
            </div>
          )}
        </aside>

        {/* Right: Tabs */}
        <div>
          {/* Tab bar */}
          <div role="tablist" aria-label="Formatos do brief" className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1 mb-5">
            {brief.formats.map(fmt => (
              <button
                key={fmt}
                role="tab"
                aria-selected={activeTab === fmt}
                aria-controls={`panel-${fmt}`}
                id={`tab-${fmt}`}
                type="button"
                onClick={() => setActiveTab(fmt)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  activeTab === fmt
                    ? 'bg-white text-primary shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* eslint-disable-next-line security/detect-object-injection */}
                {FORMAT_LABELS[fmt] ?? fmt}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              {activeTab === 'estatico' && brief.content.estatico && (
                <EstaticoContent data={brief.content.estatico} />
              )}
              {activeTab === 'story' && brief.content.story && (
                <StoryContent data={brief.content.story} />
              )}
              {activeTab === 'ugc' && brief.content.ugc && (
                <UgcContent data={brief.content.ugc} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
