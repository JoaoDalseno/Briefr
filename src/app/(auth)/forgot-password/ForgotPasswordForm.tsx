'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/SubmitButton'
import { forgotPasswordAction } from './actions'
import type { AuthActionState } from '@/app/(auth)/login/actions'

const initialState: AuthActionState = {}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(forgotPasswordAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
        <div className="mb-2 text-2xl">📬</div>
        <h2 className="mb-2 text-lg font-semibold text-blue-900">Email enviado</h2>
        <p className="text-sm text-blue-700">{state.message}</p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">Recuperar senha</h2>
      <p className="mb-6 text-sm text-gray-500">
        Insira seu email e enviaremos um link para redefinir sua senha.
      </p>

      <form action={formAction} noValidate className="space-y-4">
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

        {state.error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <SubmitButton label="Enviar link de recuperação" loadingLabel="Enviando..." />
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Lembrou a senha?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  )
}
