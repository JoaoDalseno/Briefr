'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/SubmitButton'
import { signupAction, type AuthActionState } from './actions'

// Re-exported from login/actions via signup/actions — keep consistent
import type {} from '@/app/(auth)/login/actions'

const initialState: AuthActionState = {}

export function SignupForm() {
  const [state, formAction] = useFormState(signupAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-2 text-2xl">✉️</div>
        <h2 className="mb-2 text-lg font-semibold text-green-900">Verifique seu email</h2>
        <p className="text-sm text-green-700">{state.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Criar conta grátis</h2>

      <form action={formAction} noValidate className="space-y-4">
        {/*
          Honeypot: campo invisível para detectar bots.
          CSS oculta do usuário real. Bots de formulário preenchem tudo.
          NÃO use display:none — alguns bots detectam e ignoram.
        */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
          tabIndex={-1}
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            placeholder="João Silva"
          />
        </div>

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
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••••"
          />
          <p className="text-xs text-gray-500">
            Mínimo 10 caracteres, com ao menos 1 letra e 1 número.
          </p>
        </div>

        {state.error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <SubmitButton label="Criar conta" loadingLabel="Criando conta..." />

        <p className="text-center text-xs text-gray-400">
          Ao criar uma conta você concorda com os{' '}
          <Link href="/termos" className="underline hover:text-gray-600">
            Termos de Uso
          </Link>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Já tem uma conta?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
