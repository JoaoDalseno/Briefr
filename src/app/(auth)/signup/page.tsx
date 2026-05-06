import { Metadata } from 'next'
import { SignupForm } from './SignupForm'

export const metadata: Metadata = {
  title: 'Criar conta — Briefr',
}

export default function SignupPage() {
  return <SignupForm />
}
