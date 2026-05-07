import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/server'

const waitlistSchema = z.object({
  name:    z.string().min(2).max(100).transform(v => v.trim()),
  email:   z.string().email('Email inválido').max(254),
  profile: z.enum(['gestor', 'anunciante', 'agencia', 'outro']),
  volume:  z.string().optional(),
})

const PROFILE_LABELS: Record<string, string> = {
  gestor:      'Gestor de tráfego',
  anunciante:  'Anunciante direto',
  agencia:     'Agência / Freelancer',
  outro:       'Outro',
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const parsed = waitlistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()

  // Upsert: same email = update, not duplicate
  const { error } = await admin.from('waitlist').upsert(
    {
      name:    parsed.data.name,
      email:   parsed.data.email,
      profile: parsed.data.profile,
      volume:  parsed.data.volume ?? null,
    },
    { onConflict: 'email' }
  )

  if (error) {
    console.error('[waitlist] insert error:', error.message)
    return NextResponse.json({ error: 'Erro ao registrar. Tente novamente.' }, { status: 500 })
  }

  // ── Email de confirmação via Resend ──────────────────────────────────────
  // Não bloqueia a resposta — falha no email não cancela o cadastro
  void sendConfirmationEmail(parsed.data.name, parsed.data.email, parsed.data.profile)

  return NextResponse.json({ joined: true }, { status: 201 })
}

async function sendConfirmationEmail(name: string, email: string, profile: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[waitlist] Resend não configurado — email de confirmação não enviado.')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const firstName = name.split(' ')[0]
  const profileLabel = PROFILE_LABELS[profile as keyof typeof PROFILE_LABELS] ?? profile // eslint-disable-line security/detect-object-injection

  try {
    await resend.emails.send({
      from:    'Briefr <noreply@briefr.com.br>',
      to:      email,
      subject: '✦ Você está na lista do Briefr!',
      html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Você está na lista do Briefr</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFCF5;font-family:'Inter',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFCF5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #E8DCC4;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#C2410C;padding:28px 32px;text-align:center;">
              <span style="font-size:22px;font-weight:700;color:#FFFCF5;letter-spacing:-0.03em;">
                Briefr
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#C2410C;letter-spacing:0.08em;text-transform:uppercase;">
                ✦ Acesso antecipado
              </p>
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:700;color:#1F1A14;line-height:1.2;letter-spacing:-0.02em;">
                Você está na lista, ${firstName}!
              </h1>
              <p style="margin:0 0 20px;font-size:15px;color:#6B6258;line-height:1.7;">
                Recebemos seu cadastro. Assim que abrirmos novas vagas, você será um dos primeiros a saber — direto na sua caixa de entrada.
              </p>
              <table style="background:#FAF6EE;border:1px solid #E8DCC4;border-radius:10px;padding:16px 20px;margin-bottom:24px;width:100%;" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#9A9080;letter-spacing:0.06em;text-transform:uppercase;">Seu perfil</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#1F1A14;">${profileLabel}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-size:15px;color:#6B6258;line-height:1.7;">
                Enquanto espera, nos siga no Instagram para ver bastidores e dicas de criativos:
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="https://instagram.com/briefrapp" target="_blank"
                       style="display:inline-block;background:#C2410C;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:999px;">
                      @briefrapp no Instagram →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #E8DCC4;">
              <p style="margin:0;font-size:12px;color:#9A9080;line-height:1.6;">
                Você recebeu esse email porque se cadastrou na waitlist do Briefr.<br/>
                Sem spam — só um email quando liberar seu acesso.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    })
  } catch (err) {
    // Falha no email não deve afetar o cadastro — apenas logar
    console.error('[waitlist] falha ao enviar email de confirmação:', err)
  }
}
