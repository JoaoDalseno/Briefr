'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Plus,
  Clock,
  BookTemplate,
  Settings,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { Logo } from '@/components/branding/Logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  plan?: string
  userName?: string
  onClose?: () => void
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/dashboard',          icon: LayoutDashboard, paidOnly: false },
  { label: 'Novo Brief',   href: '/dashboard/new-brief', icon: Plus,            paidOnly: false },
  { label: 'Histórico',    href: '/dashboard/history',   icon: Clock,           paidOnly: false },
  { label: 'Templates',    href: '/dashboard/templates', icon: BookTemplate,    paidOnly: true  },
  { label: 'Configurações',href: '/dashboard/settings',  icon: Settings,        paidOnly: false },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar({ plan = 'free', userName, onClose }: SidebarProps) {
  const pathname = usePathname()
  const isFree = plan === 'free'

  return (
    <aside className="flex h-full w-64 flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <Logo size="sm" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ label, href, icon: Icon, paidOnly }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          const locked = paidOnly && isFree

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'border-l-2 border-primary bg-primary/8 text-primary pl-[10px]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent pl-[10px]'
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {locked && (
                <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  Pro
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Plan card footer */}
      <div className="shrink-0 p-4 border-t border-border">
        {isFree ? (
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="size-3.5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Plano Free</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-snug">
              3 briefs por mês. Faça upgrade para ilimitado.
            </p>
            <Link
              href="/dashboard/settings?upgrade=1"
              className={cn(buttonVariants({ size: 'sm' }), 'w-full justify-between text-xs')}
            >
              Fazer upgrade
              <ChevronRight className="size-3" />
            </Link>
          </div>
        ) : (
          <div className="rounded-xl bg-muted p-4">
            <div className="flex items-center gap-2">
              <Zap className="size-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Plano {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </span>
            </div>
            {userName && (
              <p className="mt-1 text-xs text-muted-foreground truncate">{userName}</p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
