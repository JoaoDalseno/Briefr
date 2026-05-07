'use server'

import { headers } from 'next/headers'
import { signupSchema } from '@/lib/validations/auth'
import { signupRateLimit, getClientIp } from '@/lib/rate-limit'
import { createServerClient } from '@/lib/supabase/server'
import type { AuthActionState } from '@/app/(auth)/login/actions'
export type { AuthActionState } from '@/app/(auth)/login/actions'

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = getClientIp(headers())

  // 1. Honeypot: se o campo "website" estiver preenchido, é um bot.
  //    Retornamos sucesso silencioso para não dar dicas ao bot.
  const honeypot = formData.get('website') as string
  if (honeypot && honeypot.length > 0) {
    return { success: true, message: 'Verifique seu email para confirmar o cadastro.' }
  }

  // 2. Rate limit: 3 cadastros por IP por hora
  const { success: rateLimitOk, reset } = await signupRateLimit.limit(ip)
  if (!rateLimitOk) {
    const retryAfterMin = Math.ceil((reset - Date.now()) / 60_000)
    return {
      error: `Limite de cadastros atingido. Tente novamente em ${retryAfterMin} minuto(s).`,
    }
  }

  // 3. Validar campos
  const parsed = signupSchema.safeParse({
    website: honeypot,
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { error: firstError ?? 'Dados inválidos. Verifique os campos e tente novamente.' }
  }

  // 4. Criar conta no Supabase
  const supabase = createServerClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      // Supabase enviará email de confirmação com link para /auth/callback
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    // Mensagem genérica — não revelar se o email já está cadastrado
    return {
      error: 'Não foi possível criar a conta. Tente novamente ou use outro email.',
    }
  }

  // Sucesso: usuário deve confirmar o email
  return {
    success: true,
    message: 'Verifique seu email para confirmar o cadastro.',
  }
}
