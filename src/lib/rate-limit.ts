// Server-side only — never import in client components.
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/** 5 tentativas de login por IP a cada 15 minutos */
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'rl:login',
})

/** 3 cadastros por IP por hora */
export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rl:signup',
})

/** 3 pedidos de recuperação por email por hora */
export const forgotPasswordRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rl:forgot',
})

/** 30 gerações por user_id por hora — previne abuso mesmo em planos pagos */
export const generateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 h'),
  prefix: 'rl:generate',
})

/** Extrai o IP real do request (considera proxies e Vercel) */
export function getClientIp(headersList: Headers): string {
  return (
    headersList.get('x-real-ip') ??
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1'
  )
}
