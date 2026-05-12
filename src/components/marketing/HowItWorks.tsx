"use client";

import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animations";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    number: "01",
    title: "Descreva seu produto",
    description:
      "Cole a página de vendas, o nome do produto e a promessa. Briefr puxa o resto.",
  },
  {
    number: "02",
    title: "A IA monta o brief completo",
    description:
      "Em até 2 minutos, você recebe hooks, roteiro, métricas e direção visual, prontos para revisar.",
  },
  {
    number: "03",
    title: "Exporte para o designer",
    description:
      "PDF tipografado ou link compartilhável com comentários. Sem CTRL+C, CTRL+V no WhatsApp.",
  },
];

function Step({
  step,
  delay,
}: {
  step: (typeof STEPS)[0];
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Large number */}
      <span
        className="font-serif font-normal leading-none select-none"
        style={{
          fontSize: "64px",
          color: "#F4E8D6",
          letterSpacing: "-0.02em",
        }}
      >
        {step.number}
      </span>
      <div className="space-y-2">
        <h3 className="font-sans text-lg font-semibold text-[#1F1A14] leading-snug">
          {step.title}
        </h3>
        <p className="font-sans text-sm text-[#6B6258] leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-[#FFFCF5]">
      <Container>
        {/* Header */}
        <FadeUp className="text-center mb-16">
          <p className="font-mono text-[11px] text-[#9A9080] uppercase tracking-[0.08em] mb-3">
            <span className="text-[#C2410C]">✦</span> Como funciona
          </p>
          <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] text-[#1F1A14] leading-tight">
            Três passos.
            <br />
            <em className="font-serif" style={{ color: "#C2410C" }}>Sem prancheta, sem reunião.</em>
          </h2>
          <p className="mt-4 font-sans text-base sm:text-lg text-[#6B6258] max-w-xl mx-auto leading-relaxed">
            Você descreve o produto. A IA monta o brief. O designer já sai produzindo — com tudo o que precisa em mãos.
          </p>
        </FadeUp>

        {/* Steps */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Dashed connector on desktop */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-8 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] border-t border-dashed border-[#E8DCC4]"
          />

          {STEPS.map((step, i) => (
            <Step key={step.number} step={step} delay={i * 0.12} />
          ))}
        </div>
      </Container>
    </section>
  );
}
