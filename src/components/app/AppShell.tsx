'use client'

import * as React from 'react'
import { Sidebar } from '@/components/app/Sidebar'
import { TopBar } from '@/components/app/TopBar'
import { FeedbackWidget } from '@/components/app/FeedbackWidget'
import { cn } from '@/lib/utils'

interface AppShellProps {
  plan: string
  userName?: string
  userEmail?: string
  children: React.ReactNode
}

function MobileSidebarOverlay({
  open,
  plan,
  userName,
  onClose,
}: {
  open: boolean
  plan: string
  userName?: string
  onClose: () => void
}) {
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar plan={plan} userName={userName} onClose={onClose} />
      </div>
    </>
  )
}

export function AppShell({ plan, userName, userEmail, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar plan={plan} userName={userName} />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebarOverlay
        open={mobileOpen}
        plan={plan}
        userName={userName}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar
          userName={userName}
          userEmail={userEmail}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Feedback widget — bottom right */}
      <FeedbackWidget />
    </div>
  )
}
