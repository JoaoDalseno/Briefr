'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, Bell, LogOut, Settings, CreditCard, User } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopBarProps {
  userName?: string
  userEmail?: string
  userInitials?: string
  onMenuClick?: () => void
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary uppercase select-none">
      {initials}
    </span>
  )
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

interface DropdownProps {
  open: boolean
  userName?: string
  userEmail?: string
  initials: string
  onClose: () => void
}

function UserDropdown({ open, userName, userEmail, initials, onClose }: DropdownProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />

      {/* Menu */}
      <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-white shadow-card py-1 overflow-hidden">
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Avatar initials={initials} />
          <div className="min-w-0">
            {userName && <p className="text-sm font-semibold truncate">{userName}</p>}
            {userEmail && <p className="text-xs text-muted-foreground truncate">{userEmail}</p>}
          </div>
        </div>

        {/* Links */}
        {[
          { label: 'Perfil', href: '/dashboard/settings', icon: User },
          { label: 'Assinatura', href: '/dashboard/settings?tab=billing', icon: CreditCard },
          { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Icon className="size-4 text-muted-foreground" />
            {label}
          </Link>
        ))}

        <div className="border-t border-border mt-1 pt-1">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TopBar({ userName, userEmail, userInitials, onMenuClick }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const initials = userInitials ?? (userName ? userName.slice(0, 2).toUpperCase() : 'U')

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-white px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className={cn(
          'lg:hidden flex items-center justify-center size-8 rounded-lg',
          'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
        )}
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar briefs..."
            className={cn(
              'w-full rounded-lg border border-border bg-muted/50 py-2 pl-9 pr-4',
              'text-sm placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/40',
              'transition-colors'
            )}
          />
        </div>
      </div>

      <div className="flex-1 lg:flex-none" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications (placeholder) */}
        <button
          type="button"
          className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted transition-colors"
            aria-label="Menu do usuário"
            aria-expanded={dropdownOpen}
          >
            <Avatar initials={initials} />
            {userName && (
              <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">
                {userName.split(' ')[0]}
              </span>
            )}
          </button>

          <UserDropdown
            open={dropdownOpen}
            userName={userName}
            userEmail={userEmail}
            initials={initials}
            onClose={() => setDropdownOpen(false)}
          />
        </div>
      </div>
    </header>
  )
}
