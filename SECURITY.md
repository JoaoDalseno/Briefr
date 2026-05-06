# Security Policy — Briefr

## Reportar uma Vulnerabilidade

Se você encontrou uma vulnerabilidade de segurança no Briefr, **não abra uma issue pública**.
Vulnerabilidades públicas podem ser exploradas antes de serem corrigidas.

### Como reportar

Envie um email para: **security@briefr.com.br**

Inclua no email:
- Descrição clara da vulnerabilidade
- Passos para reproduzir (proof of concept se possível)
- Impacto potencial (quais dados ou sistemas podem ser afetados)
- Sua sugestão de correção (opcional)

Você receberá uma resposta inicial em até **48 horas** (dias úteis).

---

## Política de Disclosure Responsável

Seguimos o modelo de **Responsible Disclosure (Coordinated Vulnerability Disclosure)**:

| Etapa | Prazo |
|---|---|
| Confirmação de recebimento | 48 horas |
| Triagem e classificação | 5 dias úteis |
| Correção de vulnerabilidades críticas | 7 dias |
| Correção de vulnerabilidades altas | 30 dias |
| Correção de vulnerabilidades médias/baixas | 90 dias |
| Divulgação pública (após correção) | Combinada com o pesquisador |

Pedimos que você:
- Não explore a vulnerabilidade além do necessário para demonstrá-la
- Não acesse dados de outros usuários
- Não realize ataques de DoS ou destruição de dados
- Não divulgue publicamente antes da correção estar em produção

Em troca, nos comprometemos a:
- Reconhecer sua descoberta (se desejar)
- Manter você informado do progresso da correção
- Não tomar ação legal contra pesquisadores de boa-fé

---

## Escopo

### Em escopo
- Aplicação web em produção (briefr.com.br)
- API Routes (autenticação, geração de briefs, billing)
- Fluxo de autenticação Supabase
- Integração Stripe (checkout, webhook)

### Fora de escopo
- Ataques de força bruta (já mitigados com rate limiting)
- Spam ou abuso do sistema de email
- Vulnerabilidades em dependências de terceiros sem impacto demonstrável
- Ataques de engenharia social
- Vulnerabilidades que requerem acesso físico ao servidor

---

## Versões Suportadas

| Versão | Suportada |
|---|---|
| Produção (latest) | Sim |
| Versões anteriores | Não |

Mantemos apenas a versão mais recente em produção.

---

## Histórico de Vulnerabilidades

Nenhuma vulnerabilidade reportada publicamente até o momento.
