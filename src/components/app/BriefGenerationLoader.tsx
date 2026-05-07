'use client'

import * as React from 'react'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const MESSAGES = [
  'Analisando seu produto...',
  'Estudando o mercado brasileiro...',
  'Montando hooks que convertem...',
  'Estruturando os formatos...',
  'Finalizando o brief...',
]

interface BriefGenerationLoaderProps {
  className?: string
}

export function BriefGenerationLoader({ className }: BriefGenerationLoaderProps) {
  const [msgIndex, setMsgIndex] = React.useState(0)
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-8 py-20 px-4 text-center',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Gerando seu brief"
    >
      {/* Animated logo */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <Zap className="size-9 text-primary animate-bounce" />
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="size-2 rounded-full bg-primary/40 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Rotating message */}
      <div className="min-h-[48px] flex items-center">
        <p
          className={cn(
            'text-base font-medium text-foreground transition-opacity duration-300',
            visible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {MESSAGES[msgIndex] /* eslint-disable-line security/detect-object-injection */}
        </p>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        A IA está analisando cada detalhe do seu produto para criar um brief que converte.
        <br />
        <span className="font-medium text-foreground/70">Isso leva cerca de 20 segundos.</span>
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[progress_20s_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  )
}
