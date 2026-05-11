"use client";

import { Container } from "@/components/ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/animations";

const FEATURES = [
  {
    ordinal: "01",
    title: "Hooks que param o scroll",
    description:
      "3 opções calibradas pro mercado BR, com rationale de por que cada um funciona para o seu público específico.",
  },
  {
    ordinal: "02",
    title: "Roteiro de vídeo UGC",
    description:
      "Segundo a segundo: o que mostrar, o que falar, qual cena. Pronto para o creator gravar sem perguntar nada.",
  },
  {
    ordinal: "03",
    title: "Métricas esperadas",
    description:
      "CTR de referência por nicho e o que otimizar se a campanha não performar como esperado.",
  },
  {
    ordinal: "04",
    title: "Direção visual",
    description:
      "Paleta de cores, estilo de cena e elemento principal. Designer entende e executa sem revisões extras.",
  },
  {
    ordinal: "05",
    title: "Exportação PDF",
    description:
      "Brief formatado com logo do Briefr, pronto para enviar ao cliente ou guardar no histórico da conta.",
  },
  {
    ordinal: "06",
    title: "Link compartilhável",
    description:
      "Compartilhe o brief sem login. Creator abre no celular e já começa a gravar no mesmo dia.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#FFFCF5]">
      <Container>
        {/* Header */}
        <FadeUp className="text-center mb-14">
          <p className="font-mono text-[11px] text-[#9A9080] uppercase tracking-[0.08em] mb-3">
            — Recursos
          </p>
          <div className="section-rule mb-5" />
          <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] text-[#1F1A14] leading-tight">
            Antes levava horas,
            <br />
            agora leva{" "}
            <em className="font-serif" style={{ color: "#C2410C" }}>
              2 minutos.
            </em>
          </h2>
          <p className="mt-4 font-sans text-base sm:text-lg text-[#6B6258] max-w-xl mx-auto leading-relaxed">
            A Briefr transforma dados do produto em brief executável, pronto
            para passar ao designer ou creator UGC.
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
