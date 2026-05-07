/* eslint-disable security/detect-object-injection */
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === 'production',

  beforeSend(event) {
    // ── Sanitização de PII no servidor ───────────────────────────────────────

    // Remove cookies e headers sensíveis
    if (event.request?.cookies) {
      event.request.cookies = {}
    }
    if (event.request?.headers) {
      const headers = event.request.headers as Record<string, string>
      ;['authorization', 'cookie', 'stripe-signature', 'x-api-key'].forEach((h) => {
        if (headers[h]) headers[h] = '[redacted]'
      })
    }

    // Remove PII do usuário — mantém apenas ID para correlação
    if (event.user) {
      delete event.user.email
      delete event.user.username
      delete event.user.ip_address
    }

    // Redact qualquer string que pareça uma API key nos extras
    if (event.extra) {
      const redactSecrets = (obj: Record<string, unknown>) => {
        for (const key of Object.keys(obj)) {
          const lk = key.toLowerCase()
          if (
            lk.includes('key') ||
            lk.includes('secret') ||
            lk.includes('token') ||
            lk.includes('password') ||
            lk.includes('dsn')
          ) {
            obj[key] = '[redacted]'
          }
        }
      }
      redactSecrets(event.extra as Record<string, unknown>)
    }

    return event
  },

  // Ignora erros comuns sem valor de diagnóstico
  ignoreErrors: [
    'NEXT_NOT_FOUND',           // notFound() — tratado pelo Next.js
    'NEXT_REDIRECT',            // redirect() — tratado pelo Next.js
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured with value: Object Not Found Matching',
  ],
})
