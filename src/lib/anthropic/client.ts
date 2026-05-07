// Server-side only — NEVER importe em Client Components.
// A ANTHROPIC_API_KEY não tem prefixo NEXT_PUBLIC_ propositalmente:
// ela nunca deve ser exposta ao browser.
import Anthropic from '@anthropic-ai/sdk'

// Modelo padrão — atualize aqui quando quiser mudar a versão
export const ANTHROPIC_MODEL = 'claude-sonnet-4-6' as const

// Preços em USD por token (claude-sonnet-4-6 — atualize se mudar de modelo)
export const PRICING = {
  inputPerToken: 3.0 / 1_000_000,   // $3.00 / MTok
  outputPerToken: 15.0 / 1_000_000, // $15.00 / MTok
} as const

// Taxa de conversão USD → BRL (aproximada — substitua por API de câmbio se precisar)
export const USD_TO_BRL = 5.5

// Custo em BRL que dispara console.warn por request
export const COST_ALERT_THRESHOLD_BRL = 2.0

// Lazy init — o erro aparece no primeiro request, não no build
let _anthropic: Anthropic | undefined

export const anthropic = new Proxy({} as Anthropic, {
  get(_, prop): unknown {
    if (!_anthropic) {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY não definida. Verifique o .env.local.')
      }
      _anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        maxRetries: 3,
        timeout: 30_000,
      })
    }
    const instance = _anthropic
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop] // eslint-disable-line security/detect-object-injection
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

/** Calcula custo estimado em USD e BRL dado o uso de tokens */
export function calculateCost(inputTokens: number, outputTokens: number) {
  const costUsd =
    inputTokens * PRICING.inputPerToken + outputTokens * PRICING.outputPerToken
  const costBrl = costUsd * USD_TO_BRL
  return { costUsd, costBrl }
}
