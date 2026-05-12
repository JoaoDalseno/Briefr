"use client";

import { Container } from "@/components/ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/animations";

const FEATURES = [
  {
    ordinal: "01",
    title: "Hooks que param o scroll",
    description:
      "3 a 5 ganchos testados em copy brasileira — com gatilhos de dor, curiosidade e prova social.",
  },
  {
    ordinal: "02",
    title: "Roteiro de vídeo UGC",
    description:
      "Storyboard segundo a segundo, com falas sugeridas e referências de enquadramento.",
  },
  {
    ordinal: "03",
    title: "Métricas esperadas",
    description:
      "CTR, CPA e ROAS de referência com base em benchmarks da categoria no mercado brasileiro.",
  },
  {
    ordinal: "04",
    title: "Direção visual",
    description:
      "Paleta sugerida, tipografia, tom, exemplos de tratamento e o que evitar — sem placeholders genéricos.",
  },
  {
    ordinal: "05",
    title: "Exportação PDF",
    description:
      "Documento limpo e tipografado, com a sua marca, pronto para enviar pro cliente ou para o time.",
  },
  {
    ordinal: "06",
    title: "Link compartilhável",
    description:
      "Permissão por convite, comentários em linha e versionamento — tudo num link só.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#FFFCF5]">
      <Container>
        {/* Header */}
        <FadeUp className="text-center mb-14">
          <p className="font-mono text-[11px] text-[#9A9080] uppercase tracking-[0.08em] mb-3">
            <span className="text-[#C2410C]">✦</span> O que entra no brief
          </p>
          <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] text-[#1F1A14] leading-tight">
            Tudo o que o designer
            <br />
            precisa,{" "}
            <em className="font-serif" style={{ color: "#C2410C" }}>
              num documento só.
            </em>
          </h2>
          <p className="mt-4 font-sans text-base sm:text-lg text-[#6B6258] max-w-xl mx-auto leading-relaxed">
            Sem ping-pong no WhatsApp, sem &ldquo;manda referência&rdquo;, sem brief de duas linhas. Briefr entrega o pacote completo.
          </p>
        </FadeUp>

        {/* 2×3 grid */}
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ ordinal, title, description }) => (
            <StaggerItem key={title}>
              <div
                className="group relative h-full rounded-2xl border border-[#E8DCC4] bg-white p-8 transition-[border-color] duration-200 overflow-hidden hover:border-[#C2410C]"
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Ordinal number — decorative */}
                <span
                  className="absolute top-4 right-5 font-serif font-normal leading-none select-none pointer-events-none"
                  style={{ fontSize: "48px", color: "#F4E8D6" }}
                  aria-hidden
                >
                  {ordinal}
                </span>
                <h3 className="relative font-sans text-base font-semibold text-[#1F1A14] mb-2">
                  {title}
                </h3>
                <p className="relative font-sans text-sm text-[#6B6258] leading-[1.65]">
                  {description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
