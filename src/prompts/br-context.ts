// src/prompts/br-context.ts
// Biblioteca de contexto brasileiro injetada dinamicamente nos prompts

export const BR_CULTURAL_CONTEXT = `
<contexto_cultural_br>
- Brasileiro decide compra mais por confiança e prova social que por feature
- Preço em parcelas (12x R$X) converte mais que preço total na maioria dos nichos
- "Garantia" e "primeira compra com desconto" são gatilhos mais fortes que "exclusividade"
- WhatsApp é canal de vendas dominante — muitos CTAs viram "Chama no WhatsApp"
- Pix mudou o jogo do checkout — sempre mencione "à vista no Pix com desconto"
- Brasileiro tem aversão a chargeback e desconfia de site sem CNPJ visível
- Provas sociais com CPF/cidade visível ("João, SP") convertem muito mais que estrangeiras
</contexto_cultural_br>
`;

export const NICHE_PLAYBOOKS: Record<string, string> = {
    ecommerce: `
<playbook_ecommerce_br>
- Hook vencedor: mostrar produto em uso real (não foto de catálogo) nos primeiros 2s
- Objeções típicas: frete caro, prazo longo, "vai chegar quebrado", site duvidoso
- Gatilhos fortes: frete grátis acima de X, parcelamento sem juros, troca grátis 30 dias
- Sazonalidades-chave: Black Friday (todo novembro), Dia das Mães (segundo domingo de maio), Natal, Dia dos Namorados (12 jun)
- CTAs que convertem: "Comprar agora", "Garantir o meu", "Aproveitar oferta"
- Formato campeão: vídeo curto UGC com unboxing + uso real
- Evitar: linguagem corporativa fria, falta de prova social
</playbook_ecommerce_br>
`,

    infoproduto: `
<playbook_infoproduto_br>
- Mercado BR é cético — muito curso ruim queimou a categoria
- Hook vencedor: resultado específico ("Saí de R$3k pra R$15k em 90 dias") + nome real
- Objeções típicas: "Vai funcionar pra mim?", "É furada?", "Tenho tempo?"
- Gatilhos: garantia 7 dias incondicional, depoimentos com vídeo de aluno real, bônus relevante
- Plataformas dominantes: Hotmart, Kiwify, Eduzz — mencionar plataforma gera confiança
- Linguagem perigosa: "renda extra", "dinheiro fácil", "trabalhar de casa" (suspeito)
- Linguagem que converte: "passo a passo", "método", "do zero ao primeiro [resultado]"
- CTAs: "Quero ver mais", "Garantir minha vaga", "Aprender o método"
</playbook_infoproduto_br>
`,

    servicos: `
<playbook_servicos_br>
- Hook vencedor: nomear a dor específica ("Cansado de gastar com tráfego e não vender?")
- Objeções típicas: preço, prazo, qualidade, "vai me dar trabalho?"
- Gatilhos: case real com nome do cliente, antes/depois, primeira sessão grátis
- Linguagem que converte: "Sem complicação", "A gente cuida de tudo", "Você só [coisa simples]"
- CTAs: "Falar com especialista", "Pedir orçamento", "Agendar conversa"
- Formato campeão: depoimento de cliente real falando do problema antes/depois
- Localização importa muito — "atendemos toda Grande SP" converte mais que vago
</playbook_servicos_br>
`,

    saas: `
<playbook_saas_br>
- Mercado SaaS BR ainda em formação — público precisa entender o conceito antes de comprar
- Hook vencedor: mostrar a interface fazendo a coisa nos primeiros 3 segundos
- Objeções típicas: "Já tem ferramenta", "É difícil migrar", "Cara demais"
- Gatilhos: free trial sem cartão, integração com WhatsApp, suporte em português
- Linguagem que converte: "feito no Brasil", "fala português", "integra com [ferramenta BR]"
- Evitar: jargão de fundador ("disrupt", "scaling", "growth") — público acha pretensioso
- CTAs: "Testar grátis", "Ver demo de 2 min", "Começar agora"
</playbook_saas_br>
`,

    clinicas_estetica: `
<playbook_estetica_br>
- Setor MUITO regulado — cuidado com promessas de resultado
- Hook vencedor: cliente real falando depois de procedimento
- Objeções típicas: dói? quanto custa? quantas sessões?
- Gatilhos: avaliação grátis, parcelamento, garantia de satisfação
- Compliance crítico: NUNCA prometer "sem dor", "resultado garantido", "100% eficaz"
- Linguagem segura: "pode reduzir", "tende a melhorar", "muitos clientes relatam"
- CTAs: "Agendar avaliação", "Tirar dúvidas no WhatsApp"
</playbook_estetica_br>
`,

    imobiliario: `
<playbook_imobiliario_br>
- Hook vencedor: tour rápido pelo imóvel (vídeo) + preço/condição
- Objeções típicas: "É no escuro?", "Documentação ok?", "Posso financiar?"
- Gatilhos: subsídio, financiamento Caixa aprovado, entrada parcelada
- Diferenciais BR: Minha Casa Minha Vida, FGTS, ITBI grátis
- CTAs: "Quero visitar", "Receber matrícula", "Falar com corretor"
- Formato campeão: vídeo de 30s com tour do imóvel + valor + condições
</playbook_imobiliario_br>
`,
};

export function getNicheContext(niche: string | undefined): string {
    if (!niche) return '';

    const normalizedNiche = niche.toLowerCase().trim();

    // Match keywords pra escolher o playbook certo
    if (normalizedNiche.includes('ecommerce') || normalizedNiche.includes('loja')) {
        return NICHE_PLAYBOOKS.ecommerce;
    }
    if (normalizedNiche.includes('curso') || normalizedNiche.includes('mentoria') || normalizedNiche.includes('infoproduto')) {
        return NICHE_PLAYBOOKS.infoproduto;
    }
    if (normalizedNiche.includes('servico') || normalizedNiche.includes('consultoria') || normalizedNiche.includes('agencia')) {
        return NICHE_PLAYBOOKS.servicos;
    }
    if (normalizedNiche.includes('saas') || normalizedNiche.includes('software')) {
        return NICHE_PLAYBOOKS.saas;
    }
    if (normalizedNiche.includes('clinic') || normalizedNiche.includes('estetic')) {
        return NICHE_PLAYBOOKS.clinicas_estetica;
    }
    if (normalizedNiche.includes('imovel') || normalizedNiche.includes('imobiliari')) {
        return NICHE_PLAYBOOKS.imobiliario;
    }

    return '';
}

export const PLATFORM_SPECIFICS: Record<string, string> = {
    meta: `
<plataforma_meta>
- Limite de texto na imagem: 20% da área (regra antiga, hoje é flexível mas ainda penaliza)
- Headline limit: 40 caracteres pro feed
- Primary text: 125 caracteres antes do "ver mais"
- Public é mais maduro (28-55 maioria) e procura validação social
- Stories vendem produto, Feed vende marca, Reels vende conceito
- CTA buttons disponíveis: "Comprar agora", "Saiba mais", "Cadastre-se", "Inscrever-se"
</plataforma_meta>
`,
    google: `
<plataforma_google>
- Search Ads: público com intenção alta — copy direto resolve melhor
- Headline: 30 caracteres x 15 variações (Google testa combinações)
- Description: 90 caracteres x 4 variações
- Display: criativo precisa funcionar em vários tamanhos automaticamente
- YouTube Ads: primeiros 5 segundos antes do skip são tudo
- Sitelinks e callouts ampliam clique — sempre maximizar
</plataforma_google>
`,
    tiktok: `
<plataforma_tiktok>
- Hook DEVE acontecer no segundo 0 — sem intro, sem logo
- Estética não-corporativa converte mais que produção polida
- UGC funciona muito mais que conteúdo de marca
- Som original/trending boost orgânico
- Público mais jovem (16-30 maioria) — gírias atualizadas
- "Veja como" e "POV:" são hooks campeões
- Vídeo precisa ter legenda queimada (muita gente assiste sem som)
</plataforma_tiktok>
`,
};