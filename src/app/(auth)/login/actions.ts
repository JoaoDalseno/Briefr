'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginSchema } from '@/lib/validations/auth'
import { loginRateLimit, getClientIp } from '@/lib/rate-limit'
import { createServerClient } from '@/lib/supabase/server'

export type AuthActionState = {
  error?: string
  success?: boolean
  message?: string
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = getClientIp(headers())

  // 1. Rate limit: 5 tentativas por IP a cada 15 min
  const { success: rateLimitOk, reset } = await loginRateLimit.limit(ip)
  if (!rateLimitOk) {
    const retryAfterMin = Math.ceil((reset - Date.now()) / 60_000)
    return {
      error: `Muitas tentativas. Tente novamente em ${retryAfterMin} minuto(s).`,
    }
  }

  // 2. Validar campos
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    // Mensagem genérica — não revelar qual campo é inválido
    return { error: 'Email ou senha inválidos.' }
  }

  // 3. Tentar autenticar
  const supabase = createServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    // NUNCA revelar se o email existe ou se a senha está errada
    return { error: 'Email ou senha inválidos.' }
  }

  // 4. Redirecionar para destino original (ou dashboard)
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'
  const safePath = redirectTo.startsWith('/') ? redirectTo : '/dashboard'
  redirect(safePath)
}
