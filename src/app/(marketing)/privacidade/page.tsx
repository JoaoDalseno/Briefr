import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e proteção de dados da plataforma Briefr.',
}

export default function PrivacidadePage() {
  return (
    <div className="py-16">
      <Container size="narrow">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-10">Última atualização: maio de 2026</p>

        <div className="prose prose-sm max-w-none text-foreground [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-muted-foreground [&_ul]:space-y-1 [&_li]:leading-relaxed">
          <p>Esta política descreve como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>

          <h2>1. Dados coletados</h2>
          <p>Coletamos apenas os dados necessários para o funcionamento do serviço:</p>
          <ul>
            <li><strong>Cadastro:</strong> nome completo e endereço de email</li>
            <li><strong>Uso:</strong> briefs gerados, formatos utilizados, histórico de navegação na plataforma</li>
            <li><strong>Pagamento:</strong> processado pelo Stripe — não armazenamos dados de cartão</li>
            <li><strong>Técnicos:</strong> logs de acesso, endereço IP (anonimizado após 30 dias)</li>
          </ul>

          <h2>2. Finalidade do tratamento</h2>
          <ul>
            <li>Prestação do serviço de geração de briefs</li>
            <li>Comunicações transacionais (confirmação de conta, billing)</li>
            <li>Melhoria do produto com base em dados agregados e anônimos</li>
            <li>Cumprimento de obrigações legais</li>
          </ul>

          <h2>3. Base legal (LGPD)</h2>
          <p>O tratamento de dados é baseado em: execução de contrato (art. 7º, V), legítimo interesse (art. 7º, IX) e consentimento para comunicações de marketing (art. 7º, I).</p>

          <h2>4. Compartilhamento de dados</h2>
          <p>Seus dados são compartilhados apenas com:</p>
          <ul>
            <li><strong>Supabase</strong> — banco de dados e autenticação (infraestrutura)</li>
            <li><strong>Stripe</strong> — processamento de pagamentos</li>
            <li><strong>Resend</strong> — envio de emails transacionais</li>
            <li><strong>Sentry</strong> — monitoramento de erros (dados técnicos anonimizados)</li>
          </ul>
          <p>Não vendemos ou compartilhamos seus dados com terceiros para fins de marketing.</p>

          <h2>5. Retenção de dados</h2>
          <p>Mantemos seus dados enquanto sua conta estiver ativa. Após o cancelamento, os dados são excluídos em até 90 dias, exceto quando obrigações legais exijam retenção maior.</p>

          <h2>6. Seus direitos (LGPD)</h2>
          <p>Você tem direito a: confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação e revogação de consentimento. Solicite pelo email: <a href="mailto:privacidade@briefr.com.br" className="text-primary hover:underline">privacidade@briefr.com.br</a></p>

          <h2>7. Cookies</h2>
          <p>Utilizamos cookies essenciais para autenticação e analytics (PostHog, com dados anonimizados). Não utilizamos cookies de publicidade de terceiros.</p>

          <h2>8. Contato</h2>
          <p>DPO: <a href="mailto:privacidade@briefr.com.br" className="text-primary hover:underline">privacidade@briefr.com.br</a></p>
        </div>
      </Container>
    </div>
  )
}
