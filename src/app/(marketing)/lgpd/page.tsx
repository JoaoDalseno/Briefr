import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'LGPD — Direitos do Titular',
  description: 'Informações sobre seus direitos como titular de dados pessoais conforme a LGPD.',
}

export default function LgpdPage() {
  return (
    <div className="py-16">
      <Container size="narrow">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">LGPD — Seus direitos</h1>
        <p className="text-sm text-muted-foreground mb-10">Lei Geral de Proteção de Dados — Lei nº 13.709/2018</p>

        <div className="prose prose-sm max-w-none [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4">

          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mb-8">
            <p className="!text-foreground font-medium !mb-0">
              A Briefr respeita e cumpre integralmente a LGPD. Aqui explicamos de forma simples quais são seus direitos e como exercê-los.
            </p>
          </div>

          <h2>Seus direitos como titular</h2>
          <div className="not-prose grid gap-4">
            {[
              { right: 'Confirmação', desc: 'Confirmar se tratamos seus dados pessoais.' },
              { right: 'Acesso', desc: 'Receber uma cópia de todos os seus dados que armazenamos.' },
              { right: 'Correção', desc: 'Corrigir dados incompletos, inexatos ou desatualizados.' },
              { right: 'Anonimização', desc: 'Solicitar a anonimização de dados desnecessários.' },
              { right: 'Portabilidade', desc: 'Receber seus dados em formato estruturado (JSON/CSV).' },
              { right: 'Eliminação', desc: 'Solicitar a exclusão de todos os seus dados pessoais.' },
              { right: 'Revogação', desc: 'Revogar seu consentimento para tratamentos baseados em consentimento.' },
              { right: 'Oposição', desc: 'Se opor a tratamentos realizados com base em legítimo interesse.' },
            ].map(({ right, desc }) => (
              <div key={right} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{right}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2>Como exercer seus direitos</h2>
          <p>Entre em contato com nosso DPO (Encarregado de Proteção de Dados) pelo email:</p>
          <p><a href="mailto:privacidade@briefr.com.br" className="text-primary font-semibold hover:underline">privacidade@briefr.com.br</a></p>
          <p>Responderemos em até <strong>15 dias úteis</strong>, conforme exigido pela LGPD.</p>

          <h2>Encarregado de Dados (DPO)</h2>
          <p>Nossa empresa possui um Encarregado de Proteção de Dados responsável por garantir o cumprimento da LGPD. Contato: <a href="mailto:privacidade@briefr.com.br" className="text-primary hover:underline">privacidade@briefr.com.br</a></p>

          <h2>Autoridade Nacional de Proteção de Dados (ANPD)</h2>
          <p>Você também pode registrar reclamações diretamente na ANPD: <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.gov.br/anpd</a></p>
        </div>
      </Container>
    </div>
  )
}
