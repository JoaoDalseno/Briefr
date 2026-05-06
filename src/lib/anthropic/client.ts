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

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY não definida. Verifique o .env.local.')
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  // SDK faz backoff exponencial automaticamente entre tentativas
  maxRetries: 3,
  // 30 segundos: briefs podem ser longos, mas não queremos pendurar a rota indefinidamente
  timeout: 30_000,
})

/** Calcula custo estimado em USD e BRL dado o uso de tokens */
export function calculateCost(inputTokens: number, outputTokens: number) {
  const costUsd =
    inputTokens * PRICING.inputPerToken + outputTokens * PRICING.outputPerToken
  const costBrl = costUsd * USD_TO_BRL
  return { costUsd, costBrl }
}
