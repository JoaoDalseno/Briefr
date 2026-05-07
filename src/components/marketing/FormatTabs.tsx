"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Smartphone,
  LayoutGrid,
  Video,
  Film,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animations";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FORMATS = [
  {
    id: "estatico",
    label: "Estático 1:1",
    channel: "Meta / Instagram Feed",
    icon: Image,
    preview: {
      badge: "Estático 1:1 · Meta Ads",
      hooks: [
        "\"Ganhe 5kg de músculo em 30 dias\" — resultado direto, credível",
        "\"O motivo pelo qual seu treino não está funcionando\" — curiosidade",
        "\"+12.000 brasileiros já transformaram o físico com isso\" — prova social",
      ],
      sections: [
        {
          label: "Copy",
          value:
            "Whey isolado com absorção 3× mais rápida. +12.000 clientes no Brasil. Frete grátis hoje.",
        },
        {
          label: "CTA",
          value: "Comprar com 40% OFF →",
          highlight: true,
        },
        {
          label: "Direção visual",
          value:
            "Split-screen antes/depois em luz natural. Contraste alto. Expressão de confiança.",
        },
      ],
      metric: "CTR estimado: 2.8–4.2% · CPC médio BR: R$ 0,85",
    },
  },
  {
    id: "story",
    label: "Story 9:16",
    channel: "Instagram / Facebook Stories",
    icon: Smartphone,
    preview: {
      badge: "Story 9:16 · Instagram Stories",
      hooks: [
        "\"Ei, você ainda tá ignorando isso no treino?\" (olhando direto pra câmera)",
        "\"3 segundos pra te mostrar algo que mudou meu resultado\"",
        "\"O erro que 90% dos iniciantes comete na academia\"",
      ],
      sections: [
        {
          label: "Meio (3–12s)",
          value:
            "Problema → produto como solução → prova social rápida (\"12k pessoas já transformaram…\")",
        },
        {
          label: "CTA",
          value: "Arrasta pra cima e pega o desconto de hoje",
          highlight: true,
        },
        { label: "Duração sugerida", value: "15–30 segundos" },
      ],
      metric: "Swipe-up rate estimado: 4.5–7%",
    },
  },
  {
    id: "ugc",
    label: "Vídeo UGC 15s",
    channel: "TikTok / Reels / Meta",
    icon: Video,
    preview: {
      badge: "UGC 15s · TikTok / Reels",
      hooks: [
        "\"Cara, eu não acreditava nisso até experimentar…\" (tom casual)",
        "\"POV: você finalmente encontrou o suplemento certo\"",
        "\"Testei por 30 dias. Veja o resultado real.\"",
      ],
      sections: [
        {
          label: "Talking points",
          value:
            "① Dor antes do produto  ② Como o produto resolveu  ③ Prova (número ou reação)",
        },
        {
          label: "CTA final",
          value: "\"Link na bio pra pegar o desconto de hoje, acaba em breve\"",
          highlight: true,
        },
        {
          label: "Tom",
          value:
            "Natural, sem cortes rápidos. Fundo doméstico real. Sem trilha muito alta.",
        },
      ],
      metric: "Hook rate estimado: 68%+ (acima da média do nicho)",
    },
  },
  {
    id: "carrossel",
    label: "Carrossel",
    channel: "Meta / LinkedIn",
    icon: LayoutGrid,
    preview: {
      badge: "Carrossel · Meta Ads",
      hooks: [
        "\"5 erros que estão sabotando seu resultado\" — imagem de impacto",
        "\"O que ninguém te conta sobre suplementação no Brasil\"",
        "\"Antes: sem resultado. Depois: +8kg em 3 meses. O que mudou?\"",
      ],
      sections: [
        {
          label: "Slides 2–4",
          value:
            "Um erro por slide. Visual simples, solução prática no rodapé de cada frame.",
        },
        {
          label: "Último slide — CTA",
          value: "\"Comece hoje com o método que funciona →\" + link no bio",
          highlight: true,
        },
        {
          label: "Visual",
          value:
            "Paleta de cor consistente entre slides. Tipografia bold. Fundo sólido.",
        },
      ],
      metric: "Retenção estimada: 62% até o último slide",
    },
  },
  {
    id: "video30",
    label: "Vídeo 30s",
    channel: "YouTube / Connected TV",
    icon: Film,
    preview: {
      badge: "Vídeo 30s · YouTube / Meta",
      hooks: [
        "Visual de impacto + pergunta ousada em lettering nos primeiros 5s",
        "Depoimento real de cliente abrindo: \"Não esperava esse resultado\"",
        "Demonstração do produto em uso com contador regressivo na tela",
      ],
      sections: [
        {
          label: "Desenvolvimento (5–20s)",
          value: "Problema → agitação → solução → demonstração em 15 segundos",
        },
        {
          label: "CTA (20–30s)",
          value:
            "\"Acesse o link abaixo e garanta o seu com frete grátis hoje\"",
          highlight: true,
        },
        {
          label: "Ritmo",
          value:
            "Cortes a cada 2–3s. BG music animado. Locução + texto na tela.",
        },
      ],
      metric: "View-through rate estimado: 35–50%",
    },
  },
];

// ─── Preview Card ──────────────────────────────────────────────────────────────

function FormatPreview({ format }: { format: (typeof FORMATS)[0] }) {
  return (
    <motion.div
      key={format.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="rounded-2xl border border-[#E8DCC4] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 space-y-5"
    >
      {/* Badge */}
      <span className="inline-flex items-center rounded-full bg-[#C2410C]/10 border border-[#C2410C]/20 px-3 py-1 text-xs font-bold text-[#9A3309]">
        {format.preview.badge}
      </span>

      {/* Hooks */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6258] mb-2">
          Hooks (3 opções)
        </p>
        <ol className="space-y-2">
          {format.preview.hooks.map((hook, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-[#1F1A14]/80 leading-relaxed"
            >
              <span className="shrink-0 font-bold text-[#C2410C]">
                {i + 1}.
              </span>
              {hook}
            </li>
          ))}
        </ol>
      </div>

      {/* Sections */}
      <div className="space-y-4 pt-1 border-t border-[#E8DCC4]">
        {format.preview.sections.map(({ label, value, highlight }) => (
          <div key={label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6258] mb-1.5">
              {label}
            </p>
            {highlight ? (
              <span className="inline-flex rounded-lg bg-[#0F766E]/10 border border-[#0F766E]/20 px-3 py-1.5 text-sm font-semibold text-[#0F766E]">
                {value}
              </span>
            ) : (
              <p className="text-sm text-[#1F1A14]/75 leading-relaxed">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Metric */}
      <div className="pt-3 border-t border-[#E8DCC4] flex items-center gap-2">
        <CheckCircle2 className="size-3.5 text-[#C2410C] shrink-0" />
        <span className="text-xs text-[#6B6258]">{format.preview.metric}</span>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FormatTabs() {
  const [activeId, setActiveId] = useState(FORMATS[0].id);
  const active = FORMATS.find((f) => f.id === activeId)!;

  return (
    <section className="py-24 bg-[#FAF6EE]">
      <Container>
        {/* Header */}
        <FadeUp className="text-center mb-14">
          <span className="inline-flex items-center rounded-full border border-[#E8DCC4] bg-[#FFFCF5] px-4 py-1.5 text-xs font-semibold text-[#9A3309] mb-4">
            ✦ Formatos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1F1A14] leading-tight">
            Escolha o formato.
            <br />
            <span className="text-[#C2410C]">O Briefr entrega o restante.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6B6258] max-w-xl mx-auto leading-relaxed">
            Cada formato gera um brief específico com estrutura, linguagem e
            métricas do canal certo.
          </p>
        </FadeUp>

        {/* Grid: list left + preview right */}
        <div className="grid lg:grid-cols-[2fr_3fr] gap-6 items-start">
          {/* Format list */}
          <FadeUp delay={0.1} className="space-y-1">
            {FORMATS.map((format) => {
              const isActive = format.id === activeId;
              return (
                <button
                  key={format.id}
                  onClick={() => setActiveId(format.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all duration-200",
                    isActive
                      ? "bg-white border border-[#C2410C]/30 shadow-[0_2px_8px_rgba(194,65,12,0.08)]"
                      : "hover:bg-white/60 border border-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "w-0.5 self-stretch rounded-full transition-all duration-200 shrink-0",
                      isActive ? "bg-[#C2410C]" : "bg-transparent"
                    )}
                  />
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors shrink-0",
                      isActive ? "bg-[#C2410C]/10" : "bg-[#E8DCC4]/60"
                    )}
                  >
                    <format.icon
                      className={cn(
                        "size-4 transition-colors",
                        isActive ? "text-[#C2410C]" : "text-[#6B6258]"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        isActive ? "text-[#1F1A14]" : "text-[#6B6258]"
                      )}
                    >
                      {format.label}
                    </p>
                    <p className="text-xs text-[#9A9080] mt-0.5">
                      {format.channel}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0 transition-all duration-200",
                      isActive
                        ? "text-[#C2410C]"
                        : "text-[#6B6258]/40"
                    )}
                  />
                </button>
              );
            })}
          </FadeUp>

          {/* Preview */}
          <FadeUp delay={0.15}>
            <AnimatePresence mode="wait">
              <FormatPreview key={activeId} format={active} />
            </AnimatePresence>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
