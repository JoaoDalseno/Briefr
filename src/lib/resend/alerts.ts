// Server-side only — alertas operacionais via email para o time do Briefr.
// NUNCA envia dados sensíveis de usuários (sem emails, CPF, senhas, tokens).
import { Resend } from 'resend'

// Email de destino dos alertas — do próprio admin do Briefr
const ALERT_TO   = process.env.ADMIN_ALERT_EMAIL ?? 'alertas@briefr.com.br'
const ALERT_FROM = 'Briefr Alerts <noreply@briefr.com.br>'

// ─── Helpers internos ─────────────────────────────────────────────────────────

async function sendAlert(subject: string, html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // Em desenvolvimento sem Resend configurado, loga em vez de enviar
    console.warn('[alert] Resend não configurado. Alerta seria enviado:', { subject })
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from:    ALERT_FROM,
      to:      ALERT_TO,
      subject: `[Briefr Alert] ${subject}`,
      html,
    })
  } catch (err) {
    // Falha no alerta não deve interromper o fluxo principal
    console.error('[alert] Falha ao enviar alerta:', { subject, error: err })
  }
}

function ts(): string {
  return new Date().toISOString()
}

// ─── Alertas específicos ──────────────────────────────────────────────────────

/**
 * Dispara quando o webhook do Stripe falha N vezes consecutivas.
 * Indica problema crítico: pagamentos podem estar sendo perdidos.
 */
export async function sendWebhookFailureAlert(consecutiveFails: number): Promise<void> {
  await sendAlert(
    `Webhook Stripe falhou ${consecutiveFails}x consecutivas`,
    `
    <h2>⚠️ Webhook do Stripe com falhas consecutivas</h2>
    <p><strong>Falhas consecutivas:</strong> ${consecutiveFails}</p>
    <p><strong>Timestamp:</strong> ${ts()}</p>
    <p>Isso pode indicar:</p>
    <ul>
      <li>STRIPE_WEBHOOK_SECRET incorreto ou rotacionado sem atualização</li>
      <li>Erro no handler de evento (verificar logs da Vercel)</li>
      <li>Problema de conectividade com o Supabase</li>
    </ul>
    <p><strong>Ação imediata:</strong> Verifique os logs em Vercel → Functions → /api/stripe/webhook</p>
    `,
  )
}

/**
 * Dispara quando rate limit é atingido repetidamente pelo mesmo IP/usuário,
 * indicando possível ataque de força bruta.
 */
export async function sendRateLimitAlert(params: {
  identifier: string // IP ou user_id — NUNCA email
  endpoint: string
  hitsCount: number
}): Promise<void> {
  await sendAlert(
    `Rate limit repetido em ${params.endpoint}`,
    `
    <h2>⚠️ Rate limit atingido repetidamente</h2>
    <p><strong>Endpoint:</strong> ${params.endpoint}</p>
    <p><strong>Identificador:</strong> ${params.identifier}</p>
    <p><strong>Vezes bloqueado na última hora:</strong> ${params.hitsCount}</p>
    <p><strong>Timestamp:</strong> ${ts()}</p>
    <p>Possível ataque de força bruta ou abuso automatizado.</p>
    <p><strong>Ação:</strong> Considere bloquear o IP no Vercel Firewall ou configurar regra no Upstash.</p>
    `,
  )
}

/**
 * Dispara quando alguém autenticado tenta acessar /admin
 * mas não está na whitelist — pode indicar conta comprometida.
 */
export async function sendAdminAccessAlert(params: {
  userId: string  // UUID — não é PII diretamente identificável fora do sistema
  attemptedPath: string
}): Promise<void> {
  await sendAlert(
    `Tentativa não autorizada de acesso ao admin`,
    `
    <h2>🚨 Acesso ao /admin negado</h2>
    <p><strong>User ID:</strong> ${params.userId}</p>
    <p><strong>Path acessado:</strong> ${params.attemptedPath}</p>
    <p><strong>Timestamp:</strong> ${ts()}</p>
    <p>Um usuário autenticado tentou acessar o painel admin sem estar na whitelist.</p>
    <p><strong>Ação:</strong> Verifique o user_id no Supabase Auth se a tentativa for suspeita.</p>
    `,
  )
}

/**
 * Dispara quando um único request à Claude API tem custo acima do threshold.
 * Indica uso anormal (prompt muito longo, loop, etc.).
 */
export async function sendHighCostAlert(params: {
  userId: string
  costBrl: number
  inputTokens: number
  outputTokens: number
}): Promise<void> {
  await sendAlert(
    `Request de alto custo: R$${params.costBrl.toFixed(2)}`,
    `
    <h2>💸 Request à API Claude com custo elevado</h2>
    <p><strong>User ID:</strong> ${params.userId}</p>
    <p><strong>Custo estimado:</strong> R$${params.costBrl.toFixed(4)}</p>
    <p><strong>Input tokens:</strong> ${params.inputTokens.toLocaleString('pt-BR')}</p>
    <p><strong>Output tokens:</strong> ${params.outputTokens.toLocaleString('pt-BR')}</p>
    <p><strong>Timestamp:</strong> ${ts()}</p>
    <p>Verifique se o usuário está gerando briefs normalmente ou se há abuso do endpoint.</p>
    `,
  )
}
