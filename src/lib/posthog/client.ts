// PostHog analytics — tracks product events only.
// NEVER send: email, name, phone, CPF, or any personal data.
// NEVER send: brief content, form data, or generated text.
import posthog from 'posthog-js'

let initialized = false

export function initPostHog() {
  if (initialized || typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    if (process.env.NODE_ENV !== 'production') console.info('[posthog] key not set, skipping init')
    return
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
    autocapture: false,   // manual events only — avoids capturing PII
    disable_session_recording: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.debug()
    },
  })

  initialized = true
}

// ─── Typed event helpers ──────────────────────────────────────────────────────
// Properties allowed: plan, niche, format, count — never PII or content

type TrackEvent =
  | { event: 'signup' }
  | { event: 'first_brief_generated'; properties: { format: string; plan: string } }
  | { event: 'brief_generated'; properties: { format: string; plan: string } }
  | { event: 'upgrade_clicked'; properties: { source: string; current_plan: string } }
  | { event: 'subscription_started'; properties: { plan: string } }
  | { event: 'brief_exported'; properties: { format: 'pdf' | 'markdown' | 'notion' } }
  | { event: 'brief_shared' }
  | { event: 'onboarding_completed'; properties: { niche: string } }
  | { event: 'onboarding_skipped' }
  | { event: 'quota_limit_reached'; properties: { plan: string } }

export function track(payload: TrackEvent) {
  if (typeof window === 'undefined' || !initialized) return
  const props = 'properties' in payload ? payload.properties : {}
  posthog.capture(payload.event, props)
}

export function identifyUser(userId: string, plan: string) {
  if (typeof window === 'undefined' || !initialized) return
  // Only identify with userId (UUID) — no email, no name
  posthog.identify(userId, { plan })
}

export function resetUser() {
  if (typeof window === 'undefined' || !initialized) return
  posthog.reset()
}
