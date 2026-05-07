import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import type { BriefOutput, BriefFormInput } from '@/lib/validations/brief'

export const metadata: Metadata = {
  title: 'Brief compartilhado',
  description: 'Brief de criativo gerado pelo Briefr',
  robots: { index: false, follow: false },
}

// ─── Content renderers (server — no interactivity needed) ─────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
      {children}
    </div>
  )
}

function FormatBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider mb-4">
        {title}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

export default async function SharedBriefPage({ params }: { params: { token: string } }) {
  // Public read — uses admin to bypass RLS (brief is intentionally public)
  const admin = createAdminClient()
  const { data: brief } = await admin
    .from('briefs')
    .select('id, form_data, generated_content, formats, created_at')
    .eq('public_share_token', params.token)
    .single()

  if (!brief) notFound()

  const formData  = brief.form_data as BriefFormInput
  const content   = brief.generated_content as BriefOutput
  const formats   = brief.formats as string[]
  const createdAt = new Date(brief.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })

  const FORMAT_LABELS: Record<string, string> = {
    estatico: 'Anúncio Estático',
    story: 'Story',
    ugc: 'Vídeo UGC',
  }

  return (
    <div className="min-h-screen bg-surface/60">
      {/* Header */}
      <header className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Brief compartilhado via</p>
            <Link href="/" className="text-sm font-bold text-primary hover:underline">Briefr</Link>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">{createdAt}</p>
        </div>
      </header>

      {/* LGPD notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-center">
        <p className="text-xs text-amber-700">
          Este brief foi compartilhado publicamente pelo seu criador. Os dados aqui exibidos foram fornecidos voluntariamente.
        </p>
      </div>

      {/* Content */}
      <main id="main-content" className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">
          {formData.product_name}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Objetivo: <strong>{formData.objective}</strong> · Tom: <strong>{formData.tone}</strong>
        </p>

        {formats.includes('estatico') && content.estatico && (
          <FormatBlock title={FORMAT_LABELS.estatico}>
            <Section label="Headline">{content.estatico.headline}</Section>
            <Section label="Copy"><p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content.estatico.body}</p></Section>
            <Section label="CTA"><span className="inline-flex rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary">{content.estatico.cta}</span></Section>
            <Section label="Sugestão visual"><p className="text-sm text-foreground leading-relaxed">{content.estatico.visual_suggestion}</p></Section>
          </FormatBlock>
        )}

        {formats.includes('story') && content.story && (
          <FormatBlock title={FORMAT_LABELS.story}>
            <Section label="Hook de abertura"><p className="text-sm font-semibold text-foreground">{content.story.hook}</p></Section>
            <Section label="Desenvolvimento"><p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content.story.middle}</p></Section>
            <Section label="CTA"><span className="inline-flex rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary">{content.story.cta}</span></Section>
            <Section label="Duração sugerida"><p className="text-sm text-foreground">{content.story.duration}</p></Section>
          </FormatBlock>
        )}

        {formats.includes('ugc') && content.ugc && (
          <FormatBlock title={FORMAT_LABELS.ugc}>
            <Section label="Roteiro / Hook"><p className="text-sm font-semibold text-foreground leading-relaxed">{content.ugc.hook_script}</p></Section>
            <Section label="Pontos de conversa">
              <ul className="flex flex-col gap-2">
                {content.ugc.talking_points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </Section>
            <Section label="CTA"><span className="inline-flex rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary">{content.ugc.cta}</span></Section>
            <Section label="Tom e estilo"><p className="text-sm text-foreground leading-relaxed">{content.ugc.tone_notes}</p></Section>
          </FormatBlock>
        )}
      </main>

      {/* CTA footer */}
      <footer className="border-t border-border bg-white px-6 py-8 mt-10 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Gostou do brief? Crie os seus com IA em menos de 30 segundos.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          Crie seu próprio brief com Briefr →
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">Grátis · Sem cartão · 3 briefs inclusos</p>
      </footer>
    </div>
  )
}
