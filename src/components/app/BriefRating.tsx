'use client'

import * as React from 'react'
import { Star, Send, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  briefId: string
}

interface SavedRating {
  rating: number
  comment: string | null
  updated_at: string
}

const STAR_LABELS = ['Horrível', 'Ruim', 'Ok', 'Bom', 'Excelente']

// ─── Star selector ────────────────────────────────────────────────────────────

function Stars({
  value,
  hover,
  onHover,
  onLeave,
  onSelect,
  size = 22,
}: {
  value: number
  hover: number
  onHover: (n: number) => void
  onLeave: () => void
  onSelect: (n: number) => void
  size?: number
}) {
  const active = hover > 0 ? hover : value
  return (
    <div className="flex gap-1" onMouseLeave={onLeave}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} ${STAR_LABELS[n - 1]}`}
          onMouseEnter={() => onHover(n)}
          onClick={() => onSelect(n)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              n <= active ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-border'
            )}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BriefRating({ briefId }: Props) {
  const [saved, setSaved]       = React.useState<SavedRating | null>(null)
  const [loading, setLoading]   = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [editing, setEditing]   = React.useState(false)

  // Draft state (while the user is choosing / editing)
  const [draft, setDraft]       = React.useState(0)
  const [hover, setHover]       = React.useState(0)
  const [comment, setComment]   = React.useState('')

  // Load existing rating on mount
  React.useEffect(() => {
    fetch(`/api/briefs/${briefId}/rating`)
      .then((r) => r.json())
      .then(({ rating }) => {
        if (rating) {
          setSaved(rating)
          setDraft(rating.rating)
          setComment(rating.comment ?? '')
        }
      })
      .catch(() => {/* silently ignore */})
      .finally(() => setLoading(false))
  }, [briefId])

  function startEdit() {
    setDraft(saved?.rating ?? 0)
    setComment(saved?.comment ?? '')
    setHover(0)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setHover(0)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (draft < 1) {
      toast.error('Selecione ao menos 1 estrela para avaliar.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/briefs/${briefId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: draft, comment: comment || undefined }),
      })
      if (!res.ok) throw new Error()
      const { rating } = await res.json()
      setSaved(rating)
      setEditing(false)
      toast.success('Avaliação salva!')
    } catch {
      toast.error('Erro ao salvar avaliação. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  // ── Not yet rated: inline prompt ─────────────────────────────────────────
  if (!saved && !editing) {
    return (
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Como foi o brief gerado?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sua avaliação ajuda a IA a gerar briefs cada vez melhores.
            </p>
          </div>
          <Stars
            value={draft}
            hover={hover}
            onHover={(n) => { setHover(n); setDraft(n) }}
            onLeave={() => setHover(0)}
            onSelect={() => setEditing(true)}
          />
        </div>
      </div>
    )
  }

  // ── Form (first rating or editing existing) ───────────────────────────────
  if (editing || (!saved && draft > 0)) {
    const label = STAR_LABELS[(hover > 0 ? hover : draft) - 1] ?? ''
    return (
      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-primary/30 bg-card p-5 shadow-card">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {saved ? 'Editar avaliação' : 'Avaliar este brief'}
            </p>
            {label && (
              <p className="text-xs text-primary font-medium mt-0.5">{label}</p>
            )}
          </div>
          {saved && (
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Cancelar"
              className="flex items-center justify-center size-7 rounded-full hover:bg-muted text-muted-foreground transition-colors shrink-0"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Stars
          value={draft}
          hover={hover}
          onHover={setHover}
          onLeave={() => setHover(0)}
          onSelect={setDraft}
          size={26}
        />

        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor={`rating-comment-${briefId}`} className="text-xs font-semibold text-foreground">
            Comentário <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            id={`rating-comment-${briefId}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="O que funcionou bem? O que poderia melhorar?"
            maxLength={500}
            rows={3}
            className="resize-none rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/40 transition-colors"
            style={{ fontSize: 16 }}
          />
          <p className="text-[11px] text-muted-foreground text-right">{comment.length}/500</p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button type="submit" size="sm" disabled={submitting || draft < 1} aria-busy={submitting}>
            <Send className="size-3.5" />
            {submitting ? 'Salvando...' : 'Salvar avaliação'}
          </Button>
          {saved && (
            <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    )
  }

  // ── Already rated: summary card ───────────────────────────────────────────
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Sua avaliação</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={16}
                  className={cn(
                    n <= (saved?.rating ?? 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-transparent text-border'
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {STAR_LABELS[(saved?.rating ?? 1) - 1]}
            </span>
          </div>
          {saved?.comment && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{saved.comment}</p>
          )}
        </div>
        <button
          type="button"
          onClick={startEdit}
          className="shrink-0 text-xs text-primary hover:underline font-medium"
        >
          Editar
        </button>
      </div>
    </div>
  )
}
