import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso da plataforma Briefr.',
}

export default function TermosPage() {
  return (
    <div className="py-16">
      <Container size="narrow">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-10">Última atualização: maio de 2026</p>

        <div className="prose prose-sm max-w-none text-foreground [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-muted-foreground [&_ul]:space-y-1 [&_li]:leading-relaxed">
          <p>Ao utilizar a plataforma Briefr, você concorda com os termos abaixo. Leia com atenção.</p>

          <h2>1. Definições</h2>
          <p><strong>Briefr</strong> é uma plataforma SaaS para geração de briefs de criativos utilizando inteligência artificial, operada por [Empresa]. <strong>Usuário</strong> é toda pessoa física ou jurídica que acessa e utiliza a plataforma.</p>

          <h2>2. Uso da plataforma</h2>
          <p>O Briefr é licenciado para uso pessoal e comercial conforme o plano contratado. É proibido:</p>
          <ul>
            <li>Revender ou sublicenciar o acesso à plataforma</li>
            <li>Usar a plataforma para fins ilegais ou fraudulentos</li>
            <li>Tentar comprometer a segurança dos sistemas</li>
            <li>Criar conteúdo que viole direitos de terceiros</li>
          </ul>

          <h2>3. Propriedade do conteúdo gerado</h2>
          <p>Os briefs gerados pertencem ao usuário que os criou. A Briefr não reivindica propriedade sobre o conteúdo gerado. Você é responsável pelo uso que faz dos briefs.</p>

          <h2>4. Planos e pagamentos</h2>
          <p>Os planos pagos são cobrados mensalmente via Stripe. O cancelamento é efetivo ao final do período já pago. Não realizamos reembolsos proporcionais por cancelamentos antecipados, exceto quando exigido por lei.</p>

          <h2>5. Disponibilidade do serviço</h2>
          <p>Nos esforçamos para manter o serviço disponível 24/7, mas não garantimos disponibilidade ininterrupta. Manutenções programadas serão comunicadas com antecedência sempre que possível.</p>

          <h2>6. Limitação de responsabilidade</h2>
          <p>O Briefr não se responsabiliza por decisões de negócio tomadas com base nos briefs gerados. O conteúdo é gerado por IA e deve ser revisado antes do uso em campanhas.</p>

          <h2>7. Modificações dos termos</h2>
          <p>Podemos atualizar estes termos a qualquer momento. Mudanças significativas serão comunicadas por email com 15 dias de antecedência. O uso continuado após as mudanças implica aceitação.</p>

          <h2>8. Contato</h2>
          <p>Dúvidas sobre estes termos: <a href="mailto:legal@briefr.com.br" className="text-primary hover:underline">legal@briefr.com.br</a></p>
        </div>
      </Container>
    </div>
  )
}
