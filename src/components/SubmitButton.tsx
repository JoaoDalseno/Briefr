'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  label: string
  loadingLabel?: string
}

export function SubmitButton({ label, loadingLabel = 'Aguarde...' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
      {pending ? loadingLabel : label}
    </Button>
  )
}
