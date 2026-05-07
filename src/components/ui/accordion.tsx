'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  value: string | null
  onValueChange: (v: string) => void
  type: 'single'
}

const AccordionContext = React.createContext<AccordionContextValue>({
  value: null,
  onValueChange: () => {},
  type: 'single',
})

// ─── Root ─────────────────────────────────────────────────────────────────────

interface AccordionProps {
  type?: 'single'
  defaultValue?: string
  className?: string
  children: React.ReactNode
}

export function Accordion({ type = 'single', defaultValue, className, children }: AccordionProps) {
  const [value, setValue] = React.useState<string | null>(defaultValue ?? null)

  const onValueChange = React.useCallback((v: string) => {
    setValue(prev => (prev === v ? null : v))
  }, [])

  return (
    <AccordionContext.Provider value={{ value, onValueChange, type }}>
      <div className={cn('divide-y divide-border', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface AccordionItemContextValue {
  id: string
  open: boolean
  onToggle: () => void
}

const AccordionItemContext = React.createContext<AccordionItemContextValue>({
  id: '',
  open: false,
  onToggle: () => {},
})

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { value: selected, onValueChange } = React.useContext(AccordionContext)
  const open = selected === value

  const onToggle = React.useCallback(() => {
    onValueChange(value)
  }, [onValueChange, value])

  return (
    <AccordionItemContext.Provider value={{ id: value, open, onToggle }}>
      <div className={cn('', className)}>{children}</div>
    </AccordionItemContext.Provider>
  )
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  const { id, open, onToggle } = React.useContext(AccordionItemContext)

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`accordion-content-${id}`}
      onClick={onToggle}
      className={cn(
        'flex w-full items-center justify-between py-5 px-0 text-left',
        'text-sm font-semibold text-foreground transition-colors',
        'hover:text-primary focus-visible:outline-none focus-visible:text-primary',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
          open && 'rotate-180 text-primary'
        )}
      />
    </button>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { id, open } = React.useContext(AccordionItemContext)
  const ref = React.useRef<HTMLDivElement>(null)

  return (
    <div
      id={`accordion-content-${id}`}
      role="region"
      aria-hidden={!open}
      style={{
        maxHeight: open ? (ref.current?.scrollHeight ?? 500) + 'px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.25s ease',
      }}
    >
      <div ref={ref} className={cn('pb-5 text-sm text-muted-foreground leading-relaxed', className)}>
        {children}
      </div>
    </div>
  )
}
