import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(10, 'A senha deve ter no mínimo 10 caracteres')
  .regex(/[0-9]/, 'A senha deve conter ao menos 1 número')
  .regex(/[a-zA-Z]/, 'A senha deve conter ao menos 1 letra')

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordSchema,
})

export const signupSchema = z.object({
  // honeypot — bots preenchem, humanos não veem. Validado na action.
  website: z.string().optional(),
  full_name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    // Permite letras (incluindo acentuadas), espaços, hífens e apóstrofos
    .regex(/^[\p{L}\s'\-]+$/u, 'Nome contém caracteres inválidos'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
