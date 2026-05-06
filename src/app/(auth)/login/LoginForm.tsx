'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/SubmitButton'
import { loginAction, type AuthActionState } from './actions'

const initialState: AuthActionState = {}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Entrar na sua conta</h2>

      <form action={formAction} noValidate className="space-y-4">
        {/* Redirect destination — preserved through login */}
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="voce@exemplo.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••••"
          />
        </div>

        {state.error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <SubmitButton label="Entrar" loadingLabel="Entrando..." />
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Não tem uma conta?{' '}
        <Link href="/signup" className="font-medium text-blue-600 hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </div>
  )
}
