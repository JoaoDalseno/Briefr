"use client";

import {
  Zap,
  Video,
  BarChart2,
  Palette,
  FileText,
  Link2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/animations";

const FEATURES = [
  {
    icon: Zap,
    title: "Hooks que param o scroll",
    description:
      "3 opções calibradas pro mercado BR, com rationale de por que cada um funciona para o seu público específico.",
  },
  {
    icon: Video,
    title: "Roteiro de vídeo UGC",
    description:
      "Segundo a segundo: o que mostrar, o que falar, qual cena. Pronto para o creator gravar sem perguntar nada.",
  },
  {
    icon: BarChart2,
    title: "Métricas esperadas",
    description:
      "CTR de referência por nicho e o que otimizar se a campanha não performar como esperado.",
  },
  {
    icon: Palette,
    title: "Direção visual",
    description:
      "Paleta de cores, estilo de cena e elemento principal. Designer entende e executa sem revisões extras.",
  },
  {
    icon: FileText,
    title: "Exportação PDF",
    description:
      "Brief formatado com logo do Briefr, pronto para enviar ao cliente ou guardar no histórico da conta.",
  },
  {
    icon: Link2,
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
          <span className="inline-flex items-center rounded-full border border-[#E8DCC4] bg-[#FAF6EE] px-4 py-1.5 text-xs font-semibold text-[#9A3309] mb-4">
            ✦ Recursos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1F1A14] leading-tight">
            Antes levava horas,
            <br />
            agora leva 2 minutos.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6B6258] max-w-xl mx-auto leading-relaxed">
            A Briefr transforma dados do produto em brief executável, pronto
            para passar ao designer ou creator UGC.
          </p>
        </FadeUp>

        {/* 2×3 grid */}
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <div className="group h-full rounded-2xl border border-[#E8DCC4] bg-white p-7 transition-all duration-200 hover:border-[#C2410C]/50 hover:shadow-[0_4px_20px_rgba(194,65,12,0.08)]">
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[#FAF6EE] p-3 group-hover:bg-[#C2410C]/8 transition-colors">
                  <Icon className="size-5 text-[#C2410C]" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-[#1F1A14] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[#6B6258] leading-relaxed">
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
