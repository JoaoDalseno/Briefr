// Mapeamento entre price IDs do Stripe e planos internos do Briefr.
// NUNCA confie no client para definir o plano — sempre derive do webhook.

export const PLAN_PRICE_IDS = {
  pro:     process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  agencia: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID!,
} as const

export const PLAN_DETAILS = {
  free: {
    label:          'Free',
    priceMonthlyBrl: 0,
    briefsPerMonth: 3,
    priceId:        null,
  },
  pro: {
    label:          'Pro',
    priceMonthlyBrl: 97,
    briefsPerMonth: Infinity,
    priceId:        process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? null,
  },
  agencia: {
    label:          'Agência',
    priceMonthlyBrl: 197,
    briefsPerMonth: Infinity,
    priceId:        process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID ?? null,
  },
} as const

export type PlanType = keyof typeof PLAN_DETAILS

/** Deriva o plano Briefr a partir do price_id retornado pelo Stripe */
export function getPlanFromPriceId(priceId: string | null | undefined): PlanType {
  if (!priceId) return 'free'
  if (priceId === PLAN_PRICE_IDS.pro) return 'pro'
  if (priceId === PLAN_PRICE_IDS.agencia) return 'agencia'
  return 'free'
}

/** Mapeia o status do Stripe para os valores aceitos pelo enum do banco */
export function mapStripeStatus(
  status: string,
): 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' {
  const valid = ['active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete']
  return valid.includes(status)
    ? (status as ReturnType<typeof mapStripeStatus>)
    : 'active'
}
