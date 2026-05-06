/* eslint-disable security/detect-object-injection */
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Captura 10% das transações para performance monitoring (não sobrecarrega a cota)
  tracesSampleRate: 0.1,

  // Não ativa replay de sessão — privacidade dos usuários em primeiro lugar
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Não envia eventos em desenvolvimento
  enabled: process.env.NODE_ENV === 'production',

  beforeSend(event) {
    // ── Sanitização de PII ────────────────────────────────────────────────────
    // Remove TODOS os cookies — podem conter session tokens
    if (event.request?.cookies) {
      event.request.cookies = {}
    }

    // Remove headers sensíveis
    if (event.request?.headers) {
      const headers = event.request.headers as Record<string, string>
      const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'stripe-signature']
      sensitiveHeaders.forEach((h) => {
        if (headers[h]) headers[h] = '[redacted]'
      })
    }

    // Remove dados do usuário que identifiquem a pessoa
    // Mantém user.id para correlacionar erros sem expor PII
    if (event.user) {
      delete event.user.email
      delete event.user.username
      delete event.user.ip_address
    }

    return event
  },
})
