import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { anthropic, ANTHROPIC_MODEL, calculateCost, COST_ALERT_THRESHOLD_BRL } from '@/lib/anthropic/client'
import { generateRateLimit } from '@/lib/rate-limit'
import { briefFormSchema, briefOutputSchema, PLAN_MONTHLY_LIMITS } from '@/lib/validations/brief'
import { BRIEF_SYSTEM_PROMPT, buildUserPrompt } from '@/prompts/brief-generator'

// ─── Helpers de resposta ──────────────────────────────────────────────────────

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

  // ── 1. Autenticação ──────────────────────────────────────────────────────
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return errorResponse('Não autorizado.', 401)
  }

  const userId = user.id

  // ── 2. Rate limit por user_id (30/hora) ──────────────────────────────────
  const { success: rateLimitOk, reset } = await generateRateLimit.limit(userId)
  if (!rateLimitOk) {
    const retryAfterMin = Math.ceil((reset - Date.now()) / 60_000)
    return errorResponse(
      `Limite de requisições atingido. Tente novamente em ${retryAfterMin} minuto(s).`,
      429,
    )
  }

  // ── 3. Parse e validação do body ─────────────────────────────────────────
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return errorResponse('Body inválido: JSON malformado.', 400)
  }

  const parsed = briefFormSchema.safeParse(rawBody)
  if (!parsed.success) {
    return errorResponse(
      parsed.error.issues[0]?.message ?? 'Dados inválidos.',
      400,
    )
  }

  const formInput = parsed.data

  // ── 4. Verificação de quota ──────────────────────────────────────────────
  // Busca plano atual do usuário
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single()

  if (subError || !subscription) {
    // Sem registro de subscription = tratar como free
  }

  const plan = subscription?.plan ?? 'free'
  const monthlyLimit = PLAN_MONTHLY_LIMITS[plan] ?? PLAN_MONTHLY_LIMITS.free // eslint-disable-line security/detect-object-injection

  if (monthlyLimit !== Infinity) {
    // Conta briefs criados no mês atual
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count, error: countError } = await supabase
      .from('briefs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    if (countError) {
      console.error('[generate] quota check failed:', { userId, error: countError.message })
      return errorResponse('Erro ao verificar quota. Tente novamente.', 500)
    }

    if ((count ?? 0) >= monthlyLimit) {
      return errorResponse(
        `Você atingiu o limite de ${monthlyLimit} briefs por mês do plano ${plan}. Faça upgrade para continuar.`,
        403,
      )
    }
  }

  // ── 5. Chamada à API do Claude ───────────────────────────────────────────
  const userPrompt = buildUserPrompt(formInput)
  let claudeResponse: Awaited<ReturnType<typeof anthropic.messages.create>>

  try {
    claudeResponse = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })
  } catch (err) {
    const durationMs = Date.now() - startedAt
    const errorCode = err instanceof Error ? err.constructor.name : 'unknown'

    // Logging seguro: NUNCA logar API key ou dados do formulário
    console.error('[generate] Claude API error:', {
      userId,
      durationMs,
      errorCode,
      message: err instanceof Error ? err.message : 'unknown error',
    })

    await logUsage({
      userId,
      inputTokens: 0,
      outputTokens: 0,
      durationMs,
      success: false,
      errorCode,
    })

    return errorResponse('Erro ao gerar o brief. Tente novamente.', 502)
  }

  const durationMs = Date.now() - startedAt
  const inputTokens = claudeResponse.usage.input_tokens
  const outputTokens = claudeResponse.usage.output_tokens
  const { costUsd, costBrl } = calculateCost(inputTokens, outputTokens)

  // ── 6. Alerta de custo alto ──────────────────────────────────────────────
  if (costBrl > COST_ALERT_THRESHOLD_BRL) {
    console.warn('[generate] CUSTO ALTO POR REQUEST:', {
      userId,
      costBrl: costBrl.toFixed(4),
      costUsd: costUsd.toFixed(6),
      inputTokens,
      outputTokens,
      durationMs,
    })
  }

  // ── 7. Parse e validação do output do Claude ─────────────────────────────
  const rawText = claudeResponse.content[0]?.type === 'text'
    ? claudeResponse.content[0].text
    : ''

  let briefData: unknown
  try {
    // Remove possível bloco de markdown (```json ... ```) se o modelo errar
    const cleaned = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    briefData = JSON.parse(cleaned)
  } catch {
    console.error('[generate] Claude retornou JSON inválido:', {
      userId,
      durationMs,
      rawTextLength: rawText.length,
    })

    await logUsage({ userId, inputTokens, outputTokens, durationMs, success: false, errorCode: 'invalid_json', costUsd, costBrl })
    return errorResponse('O brief gerado está malformado. Tente novamente.', 502)
  }

  const validated = briefOutputSchema.safeParse(briefData)
  if (!validated.success) {
    console.error('[generate] output falhou na validação Zod:', {
      userId,
      durationMs,
      errors: validated.error.issues,
    })

    await logUsage({ userId, inputTokens, outputTokens, durationMs, success: false, errorCode: 'invalid_output_schema', costUsd, costBrl })
    return errorResponse('O brief gerado não seguiu o formato esperado. Tente novamente.', 502)
  }

  const generatedContent = validated.data

  // ── 8. Salva o brief no banco ────────────────────────────────────────────
  const { data: savedBrief, error: insertError } = await supabase
    .from('briefs')
    .insert({
      user_id: userId,
      form_data: formInput,
      generated_content: generatedContent,
      formats: formInput.formats,
    })
    .select('id, created_at')
    .single()

  if (insertError || !savedBrief) {
    console.error('[generate] falha ao salvar brief:', { userId, error: insertError?.message })
    await logUsage({ userId, inputTokens, outputTokens, durationMs, success: false, errorCode: 'db_insert_failed', costUsd, costBrl })
    return errorResponse('Erro ao salvar o brief. Tente novamente.', 500)
  }

  // ── 9. Log de uso (sucesso) ──────────────────────────────────────────────
  await logUsage({ userId, inputTokens, outputTokens, durationMs, success: true, costUsd, costBrl })

  // Logging seguro: apenas metadados, nunca conteúdo ou dados do formulário
  console.log('[generate] brief gerado com sucesso:', {
    userId,
    briefId: savedBrief.id,
    formats: formInput.formats,
    inputTokens,
    outputTokens,
    costBrl: costBrl.toFixed(4),
    durationMs,
  })

  // ── 10. Retorna o brief ──────────────────────────────────────────────────
  return NextResponse.json({
    id: savedBrief.id,
    createdAt: savedBrief.created_at,
    formats: formInput.formats,
    content: generatedContent,
    usage: {
      inputTokens,
      outputTokens,
      // Não retornar custo ao client — dado interno
    },
  })
}

// ─── Utilitário de logging ────────────────────────────────────────────────────

interface LogUsageParams {
  userId: string
  inputTokens: number
  outputTokens: number
  durationMs: number
  success: boolean
  errorCode?: string
  costUsd?: number
  costBrl?: number
}

async function logUsage({
  userId,
  inputTokens,
  outputTokens,
  durationMs,
  success,
  errorCode,
  costUsd = 0,
  costBrl = 0,
}: LogUsageParams) {
  try {
    // Usa admin client pois usage_log bloqueia escrita para usuários autenticados via RLS
    const admin = createAdminClient()
    await admin.from('usage_log').insert({
      user_id: userId,
      model: ANTHROPIC_MODEL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: costUsd,
      cost_brl: costBrl,
      duration_ms: durationMs,
      success,
      error_code: errorCode ?? null,
    })
  } catch (err) {
    // Falha no log não deve quebrar o request — apenas registrar
    console.error('[generate] falha ao gravar usage_log:', err)
  }
}
