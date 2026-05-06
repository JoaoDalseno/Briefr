import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { sendAdminAccessAlert } from '@/lib/resend/alerts'

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin')
  }

  const adminEmails = getAdminEmails()
  const userEmail   = user.email?.toLowerCase() ?? ''

  if (!adminEmails.includes(userEmail)) {
    // Loga tentativa não autorizada (sem revelar o email nos logs públicos)
    console.warn('[admin] Acesso negado:', { userId: user.id })

    // Alerta assíncrono — não bloqueia a resposta
    sendAdminAccessAlert({
      userId:        user.id,
      attemptedPath: '/admin',
    }).catch(() => {})

    // notFound() em vez de redirect — não revela que /admin existe
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-900">Briefr</span>
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Admin
            </span>
          </div>
          <span className="text-xs text-gray-400">Acesso restrito</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
