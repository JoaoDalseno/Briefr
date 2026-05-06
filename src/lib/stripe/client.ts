// Server-side only — NUNCA importe em Client Components.
// STRIPE_SECRET_KEY não tem prefixo NEXT_PUBLIC_ propositalmente.
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não definida. Verifique o .env.local.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Pina a versão da API para evitar breaking changes silenciosos.
  // Atualize manualmente após testar as mudanças do changelog do Stripe.
  apiVersion: '2025-04-30.basil',
  typescript: true,
})
