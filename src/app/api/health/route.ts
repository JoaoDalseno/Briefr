import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Cache-Control: no-store — health checks devem sempre refletir estado real
export const revalidate = 0

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down'
  timestamp: string
  version: string
  checks: {
    database: 'ok' | 'error'
  }
  uptime_ms: number
}

const startTime = Date.now()

export async function GET() {
  const timestamp = new Date().toISOString()
  const version   = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local'

  let dbStatus: 'ok' | 'error' = 'error'

  try {
    // Query mínima para verificar conectividade com o banco.
    // Usa admin client para não depender de sessão de usuário.
    // Não expõe dados reais — apenas verifica que a conexão responde.
    const admin = createAdminClient()
    const { error } = await admin.from('profiles').select('id').limit(1)
    dbStatus = error ? 'error' : 'ok'
  } catch {
    dbStatus = 'error'
  }

  const overallStatus: HealthStatus['status'] =
    dbStatus === 'error' ? 'down' : 'ok'

  const body: HealthStatus = {
    status:    overallStatus,
    timestamp,
    version,
    checks:    { database: dbStatus },
    uptime_ms: Date.now() - startTime,
  }

  // Retorna 200 mesmo em degraded para que monitores como Better Uptime
  // não acionem false positives em problemas parciais.
  // Retorna 503 apenas se o serviço estiver completamente down.
  const httpStatus = overallStatus === 'down' ? 503 : 200

  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
