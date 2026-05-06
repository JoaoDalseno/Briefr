// Configuração mínima para o Edge runtime (middleware).
// O Edge runtime tem limitações de API — não inclui tudo do Node.js.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.05, // Menor taxa no edge — é chamado em CADA request
  enabled: process.env.NODE_ENV === 'production',
})
