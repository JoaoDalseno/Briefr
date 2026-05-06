'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { initPostHog } from '@/lib/posthog/client'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog()
  }, [])

  // Re-trigger pageview on client-side navigation (SPA)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (posthog.__loaded) posthog.capture('$pageview')
  }, [pathname, searchParams])

  return <>{children}</>
}
