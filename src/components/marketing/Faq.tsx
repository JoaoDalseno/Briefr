import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const FAQS = [
  {
    id: 'q1',
    q: 'Como funciona a geração de briefs?',
    a: 'Você preenche um formulário com informações sobre o seu produto, público-alvo e objetivo do anúncio. Nossa IA analisa esses dados e gera um brief completo com headline, copy, CTA, sugestão visual e estrutura por formato (estático, story, vídeo, carrossel). Todo o processo leva menos de 30 segundos.',
  },
  {
    id: 'q2',
    q: 'Posso usar para qualquer plataforma de anúncios?',
    a: 'Sim. Os briefs são estruturados para funcionar no Meta Ads (Facebook e Instagram), Google Ads, TikTok e YouTube. Você pode selecionar o formato e a plataforma de destino no formulário — a IA adapta o tom e a estrutura automaticamente.',
  },
  {
    id: 'q3',
    q: 'A IA entende o contexto do meu nicho?',
    a: 'O Briefr foi desenvolvido com foco no mercado brasileiro. Ele entende contextos de e-commerce, infoprodutos, serviços locais, saúde, beleza, educação e muito mais. Quanto mais detalhes você fornecer no formulário, mais preciso e contextualizado será o resultado.',
  },
  {
    id: 'q4',
    q: 'Os briefs gerados são realmente bons?',
    a: 'Sim — mas a qualidade depende do que você coloca no formulário. Gestores que fornecem informações completas sobre o produto, diferencial e público recebem briefs que designers e copywriters conseguem executar diretamente, sem precisar de revisões extensas.',
  },
  {
    id: 'q5',
    q: 'Posso editar o brief depois de gerar?',
    a: 'Atualmente o brief é exportado como texto ou PDF. Você pode copiar o conteúdo e editar livremente onde preferir (Google Docs, Notion, etc.). A edição inline dentro do Briefr está no roadmap para os próximos meses.',
  },
  {
    id: 'q6',
    q: 'Como cancelar a assinatura?',
    a: 'Pelo próprio painel, em Configurações → Assinatura → Cancelar. O cancelamento é imediato, sem multa e sem burocracia. Você mantém o acesso até o fim do período pago e depois migra automaticamente para o plano Free.',
  },
  {
    id: 'q7',
    q: 'Tem teste grátis?',
    a: 'Sim! O plano Free inclui 3 briefs por mês sem precisar de cartão de crédito. É suficiente para experimentar a qualidade e ver se o Briefr funciona para o seu fluxo de trabalho antes de decidir por um plano pago.',
  },
  {
    id: 'q8',
    q: 'Meus dados estão seguros? E a LGPD?',
    a: 'Seus dados são armazenados com segurança no Brasil usando Supabase (infraestrutura PostgreSQL com criptografia em repouso e em trânsito). Seguimos as diretrizes da LGPD: você pode solicitar a exclusão dos seus dados a qualquer momento pelo painel ou por e-mail. Nunca vendemos ou compartilhamos seus dados com terceiros.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="py-24 bg-slate-50/60">
      <Container size="narrow">
        <SectionHeader
          eyebrow="FAQ"
          title="Perguntas frequentes"
          subtitle="Tudo que você precisa saber antes de começar."
        />

        <div className="mt-12">
          <Accordion defaultValue="q1" className="rounded-2xl border border-border bg-white shadow-card overflow-hidden divide-y divide-border">
            {FAQS.map(({ id, q, a }) => (
              <AccordionItem key={id} value={id} className="px-6">
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}
