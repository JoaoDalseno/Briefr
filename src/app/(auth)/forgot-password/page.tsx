import { Metadata } from 'next'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Recuperar senha — Briefr',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
