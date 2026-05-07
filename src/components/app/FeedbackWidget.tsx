'use client'

import * as React from 'react'
import { MessageSquarePlus, X, Send, Bug, Lightbulb, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TYPES = [
  { id: 'bug', label: 'Bug', icon: Bug, color: 'text-destructive' },
  { id: 'sugestao', label: 'Sugestão', icon: Lightbulb, color: 'text-amber-500' },
  { id: 'elogio', label: 'Elogio', icon: Heart, color: 'text-emerald-500' },
]

export function FeedbackWidget() {
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState<string>('')
  const [text, setText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  function handleOpen() {
    setOpen(true)
    setSent(false)
    setType('')
    setText('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!type || text.trim().length < 5) {
      toast.error('Escolha um tipo e descreva o feedback (mín. 5 caracteres).')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, text: text.trim() }),
      })
      if (res.ok) {
        setSent(true)
        toast.success('Feedback enviado! Obrigado 🙏')
        setTimeout(() => setOpen(false), 2000)
      } else {
        toast.error('Erro ao enviar. Tente novamente.')
      }
    } catch {
      toast.error('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!open && (
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Enviar feedback"
            title="Enviar feedback"
            className={cn(
              'flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg',
              'hover:bg-primary/90 hover:shadow-glow-sm transition-all active:scale-95'
            )}
          >
            <MessageSquarePlus className="size-4" aria-hidden />
            Feedback
          </button>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Enviar feedback"
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Enviar feedback</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="flex items-center justify-center size-7 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {sent ? (
              <div className="px-5 py-10 text-center">
                <div className="text-4xl mb-3">🙏</div>
                <p className="font-semibold text-foreground">Obrigado pelo feedback!</p>
                <p className="text-sm text-muted-foreground mt-1">Cada opinião nos ajuda a melhorar.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                {/* Type selector */}
                <fieldset>
                  <legend className="text-sm font-semibold text-foreground mb-2">Tipo</legend>
                  <div className="flex gap-2">
                    {TYPES.map(({ id, label, icon: Icon, color }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setType(id)}
                        aria-pressed={type === id}
                        className={cn(
                          'flex-1 flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-xs font-medium transition-all',
                          type === id ? 'border-primary bg-primary/8' : 'border-border hover:border-primary/40'
                        )}
                      >
                        <Icon className={cn('size-4', type === id ? 'text-primary' : color)} aria-hidden />
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="feedback-text" className="text-sm font-semibold text-foreground">
                    Descrição
                  </label>
                  <textarea
                    id="feedback-text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Descreva o bug, sugestão ou elogio..."
                    maxLength={1000}
                    rows={4}
                    className="resize-none rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/40 transition-colors"
                    style={{ fontSize: 16 }}
                  />
                  <p className="text-xs text-muted-foreground text-right">{text.length}/1000</p>
                </div>

                <Button
                  type="submit"
                  size="default"
                  className="w-full"
                  disabled={loading}
                  aria-busy={loading}
                >
                  <Send className="size-4" aria-hidden />
                  {loading ? 'Enviando...' : 'Enviar feedback'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
