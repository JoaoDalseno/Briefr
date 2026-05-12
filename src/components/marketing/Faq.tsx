import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const FAQS = [
  {
    id: 'q1',
    q: 'O Briefr substitui o redator?',
    a: 'Não. O Briefr substitui o brief — aquele documento que normalmente leva 2 horas pra ficar pronto e mesmo assim chega faltando coisa. Bons redatores continuam tão essenciais quanto antes; eles só passam menos tempo extraindo informação do cliente.',
  },
  {
    id: 'q2',
    q: 'Como vocês garantem que o tom é brasileiro?',
    a: 'Treinamos o modelo com mais de 14 mil briefs reais e copys vencedoras do mercado brasileiro, segmentados por nicho. Briefr não traduz inglês — ele entende que "gatilho de urgência" no Brasil tem cara diferente do que nos EUA.',
  },
  {
    id: 'q3',
    q: 'Funciona pra qualquer nicho?',
    a: 'Hoje suportamos suplementação, beleza, moda, e-commerce, SaaS, infoprodutos, finanças e serviços locais. Estamos adicionando 2 a 3 novos verticais por mês — se o seu nicho não está na lista, pode pedir na lista de espera que a gente prioriza.',
  },
  {
    id: 'q4',
    q: 'O que entra no plano gratuito?',
    a: '3 briefs por mês, todos os formatos, exportação PDF e link público. Histórico de 30 dias. Tudo o que você precisa pra testar a fundo antes de decidir.',
  },
  {
    id: 'q5',
    q: 'Meus dados ficam protegidos?',
    a: 'Sim. Hospedamos no Brasil (SP), criptografia em trânsito e em repouso, e nada do que você coloca no Briefr é usado para treinar modelos de terceiros. Conformidade total com LGPD.',
  },
  {
    id: 'q6',
    q: 'Posso cancelar quando quiser?',
    a: 'Quando quiser, pelo painel, em dois cliques. Sem fidelidade, sem ligação pro suporte e sem cláusula escondida. Se cancelar no meio do mês, você continua usando até o fim do ciclo pago.',
  },
  {
    id: 'q7',
    q: 'Tem integração com Meta Ads e Google Ads?',
    a: 'A integração com Meta Ads está no roadmap pro segundo semestre — vai puxar performance histórica das suas campanhas pra calibrar os briefs. Google Ads vem em seguida. Por enquanto, exportação PDF e link.',
  },
  {
    id: 'q8',
    q: 'Quando o beta abre pra todo mundo?',
    a: 'Liberação geral prevista pro Q3. Quem entra na lista de espera ganha 3 meses gratuitos no plano Pro — e prioridade pra entrar nos lotes do beta fechado enquanto isso.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="py-24 bg-surface/60">
      <Container size="narrow">
        <SectionHeader
          eyebrow="FAQ"
          title={<>Perguntas <em className="font-serif italic text-primary">recorrentes.</em></>}
          subtitle=""
        />

        <div className="mt-12">
          <Accordion defaultValue="q1" className="rounded-2xl border border-border bg-card shadow-card overflow-hidden divide-y divide-border">
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
