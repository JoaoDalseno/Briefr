import { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Entrar — Briefr',
}

interface LoginPageProps {
  searchParams: { redirectTo?: string; error?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <>
      {searchParams.error === 'auth_callback_failed' && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          O link de confirmação expirou ou é inválido. Tente novamente.
        </div>
      )}
      <LoginForm redirectTo={searchParams.redirectTo} />
    </>
  )
}
