import { z } from 'zod'

// ─── Formatos suportados ───────────────────────────────────────────────────────
export const FORMAT_VALUES = ['estatico', 'story', 'ugc'] as const
export type BriefFormat = (typeof FORMAT_VALUES)[number]

// ─── Schema de entrada (formulário do usuário) ────────────────────────────────
export const briefFormSchema = z.object({
  product_name: z
    .string()
    .min(2, 'Nome do produto deve ter ao menos 2 caracteres')
    .max(200, 'Nome do produto deve ter no máximo 200 caracteres')
    .transform((v) => v.trim()),

  target_audience: z
    .string()
    .min(10, 'Descreva o público com ao menos 10 caracteres')
    .max(500, 'Público-alvo deve ter no máximo 500 caracteres')
    .transform((v) => v.trim()),

  objective: z.enum(['vendas', 'leads', 'awareness', 'consideracao'], {
    error: () => ({ message: 'Objetivo inválido' }),
  }),

  unique_selling_point: z
    .string()
    .min(10, 'Descreva o diferencial com ao menos 10 caracteres')
    .max(500, 'Diferencial deve ter no máximo 500 caracteres')
    .transform((v) => v.trim()),

  tone: z.enum(['profissional', 'descontraido', 'urgente', 'inspirador', 'educativo'], {
    error: () => ({ message: 'Tom inválido' }),
  }),

  formats: z
    .array(z.enum(FORMAT_VALUES))
    .min(1, 'Selecione ao menos um formato')
    .max(3, 'Selecione no máximo 3 formatos'),

  additional_context: z
    .string()
    .max(1000, 'Contexto adicional deve ter no máximo 1000 caracteres')
    .transform((v) => v.trim())
    .optional(),
})

export type BriefFormInput = z.infer<typeof briefFormSchema>

// ─── Schema de saída (JSON gerado pelo Claude) ────────────────────────────────
const briefEstaticoSchema = z.object({
  headline: z.string().min(1),
  body: z.string().min(1),
  cta: z.string().min(1),
  visual_suggestion: z.string().min(1),
})

const briefStorySchema = z.object({
  hook: z.string().min(1),
  middle: z.string().min(1),
  cta: z.string().min(1),
  duration: z.string().min(1),
})

const briefUgcSchema = z.object({
  hook_script: z.string().min(1),
  talking_points: z.array(z.string().min(1)).min(2).max(6),
  cta: z.string().min(1),
  tone_notes: z.string().min(1),
})

export const briefOutputSchema = z
  .object({
    estatico: briefEstaticoSchema.optional(),
    story: briefStorySchema.optional(),
    ugc: briefUgcSchema.optional(),
  })
  .refine((data) => data.estatico || data.story || data.ugc, {
    message: 'A resposta deve conter ao menos um formato de brief',
  })

export type BriefOutput = z.infer<typeof briefOutputSchema>

// ─── Limites de quota por plano ───────────────────────────────────────────────
export const PLAN_MONTHLY_LIMITS: Record<string, number> = {
  free: 3,
  pro: Infinity,
  agencia: Infinity,
}
