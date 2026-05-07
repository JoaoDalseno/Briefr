'use server'

import { forgotPasswordSchema } from '@/lib/validations/auth'
import { forgotPasswordRateLimit } from '@/lib/rate-limit'
import { createServerClient } from '@/lib/supabase/server'
import type { AuthActionState } from '@/app/(auth)/login/actions'

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get('email') as string

  // 1. Validar email antes do rate limit (evita consumir limite com emails inválidos)
  const parsed = forgotPasswordSchema.safeParse({ email })
  if (!parsed.success) {
    return { error: 'Informe um email válido.' }
  }

  // 2. Rate limit por email: 3 pedidos por hora
  //    Usamos o email como chave (não o IP) para limitar por conta, não por rede
  const { success: rateLimitOk, reset } = await forgotPasswordRateLimit.limit(
    parsed.data.email.toLowerCase(),
  )
  if (!rateLimitOk) {
    const retryAfterMin = Math.ceil((reset - Date.now()) / 60_000)
    return {
      error: `Limite atingido. Tente novamente em ${retryAfterMin} minuto(s).`,
    }
  }

  // 3. Solicitar recuperação — SEMPRE retornar mensagem genérica de sucesso,
  //    mesmo se o email não existir (evita enumeração de contas)
  const supabase = createServerClient()
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/settings/password`,
  })

  return {
    success: true,
    message: 'Se este email estiver cadastrado, você receberá um link em breve.',
  }
}
