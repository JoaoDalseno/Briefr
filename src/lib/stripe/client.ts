// Server-side only — NUNCA importe em Client Components.
// STRIPE_SECRET_KEY não tem prefixo NEXT_PUBLIC_ propositalmente.
//
// Usa inicialização lazy para que o Next.js consiga fazer build sem as
// variáveis de produção presentes — o erro aparece apenas no primeiro request.
import Stripe from 'stripe'

let _instance: Stripe | undefined

function getInstance(): Stripe {
  if (!_instance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY não definida. Verifique o .env.local.')
    }
    _instance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return _instance
}

// Proxy transparente: callers usam `stripe.x()` normalmente, mas a instância
// só é criada quando o primeiro método é acessado (em runtime).
export const stripe = new Proxy({} as Stripe, {
  get(_, prop): unknown {
    const instance = getInstance()
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop] // eslint-disable-line security/detect-object-injection
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
