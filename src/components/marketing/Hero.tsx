"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FloatingMockup } from "@/components/animations";

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#E8DCC4] bg-white"
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06), 0 32px 64px rgba(0,0,0,0.08), 0 64px 120px rgba(0,0,0,0.06)",
      }}
    >
      {/* Browser chrome */}
      <div className="h-10 flex items-center gap-3 px-4" style={{ background: "#F5F0E8", borderBottom: "1px solid #E8DCC4" }}>
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#FF5F57]/70" />
          <span className="size-3 rounded-full bg-[#FFBD2E]/70" />
          <span className="size-3 rounded-full bg-[#28CA41]/70" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white border border-[#E8DCC4] rounded-md h-5 w-48 flex items-center justify-center">
            <span className="text-[10px] text-[#9A9080] font-mono">
              briefr.com.br/dashboard
            </span>
          </div>
        </div>
      </div>

      {/* App UI */}
      <div className="bg-[#FAF6EE] grid grid-cols-5 gap-3 p-3">
        {/* Sidebar / form */}
        <div className="col-span-2 bg-white rounded-xl border border-[#E8DCC4] p-3 space-y-3 text-xs">
          <p className="font-bold text-[9px] uppercase tracking-widest text-[#9A9080]">
            Novo brief
          </p>

          <div className="space-y-1">
            <p className="text-[#9A9080] text-[10px]">Produto</p>
            <div className="bg-[#C2410C]/5 border border-[#C2410C]/20 rounded-lg h-6 px-2 flex items-center text-[#1F1A14]/80 text-[10px]">
              Suplemento Alpha Pro
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[#9A9080] text-[10px]">Público-alvo</p>
            <div className="bg-[#FAF6EE] border border-[#E8DCC4] rounded-lg h-6 px-2 flex items-center text-[#6B6258] text-[10px]">
              Homens 25–40 que treinam…
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[#9A9080] text-[10px]">Formatos</p>
            <div className="flex gap-1 flex-wrap">
              {["Estático", "Story", "UGC"].map((f) => (
                <span
                  key={f}
                  className="bg-[#C2410C]/10 text-[#C2410C] text-[9px] font-semibold rounded-full px-2 py-0.5 border border-[#C2410C]/15"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#C2410C] text-white text-[10px] font-semibold rounded-lg h-7 flex items-center justify-center gap-1 cursor-pointer">
            Gerar brief →
          </div>
        </div>

        {/* Brief output */}
        <div className="col-span-3 bg-white rounded-xl border border-[#E8DCC4] p-3 space-y-2.5 text-xs">
          {/* Tabs */}
          <div className="flex gap-3 border-b border-[#E8DCC4] pb-2">
            <span className="text-[#C2410C] font-semibold text-[10px] border-b-2 border-[#C2410C] pb-0.5">
              Estático 1:1
            </span>
            <span className="text-[#9A9080] text-[10px]">Story 9:16</span>
            <span className="text-[#9A9080] text-[10px]">UGC 15s</span>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#9A9080] mb-1">
              Headline
            </p>
            <p className="font-semibold text-[#1F1A14] text-[11px] leading-snug">
              &quot;Ganhe 5kg de músculo em 30 dias&quot;
            </p>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#9A9080] mb-1">
              Copy
            </p>
            <p className="text-[10px] text-[#6B6258] leading-relaxed">
              Whey isolado com absorção 3× mais rápida. +12.000 clientes no
              Brasil. Frete grátis hoje.
            </p>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#9A9080] mb-1">
              CTA
            </p>
            <span className="inline-flex items-center bg-[#0F766E]/10 text-[#0F766E] text-[10px] font-semibold rounded px-2 py-0.5 border border-[#0F766E]/15">
              Comprar com 40% OFF →
            </span>
          </div>

          {/* Progress bar */}
          <div className="pt-2 border-t border-[#E8DCC4] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-[#9A9080]">
                CTR estimado: 2.8–4.2%
              </span>
              <span className="text-[10px] font-medium text-[#C2410C]">
                Exportar PDF →
              </span>
            </div>
            <div className="h-1 rounded-full bg-[#E8DCC4] overflow-hidden">
              <motion.div
                className="h-full bg-[#C2410C] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "78%" }}
                transition={{
                  duration: 1.5,
                  delay: 1.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fade gradient at bottom */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "120px",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,252,245,0.9))",
        }}
      />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFCF5] pt-32 pb-0 sm:pt-36 text-center">
      <Container>
        <div className="flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-flex items-center rounded-full border border-[#E8DCC4] bg-[#FAF6EE] px-4 py-1.5 text-[13px] font-medium text-[#9A3309]">
              ✦ Plataforma de Briefs de Criativos com IA
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-6 font-semibold leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
          >
            Briefs que convertem,
            <br />
            <span style={{ color: "#C2410C" }}>em minutos.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-6 text-[#6B6258] leading-relaxed"
            style={{ fontSize: "19px", maxWidth: "520px" }}
          >
            Descreva seu produto e a IA monta o brief completo do anúncio —
            hook, copy, roteiro e referência visual. Em português, com contexto
            BR.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#C2410C] text-white font-medium px-7 py-3.5 text-base transition-all duration-200 hover:bg-[#9A3309] hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontSize: "16px" }}
            >
              Começar grátis
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center rounded-full border border-[#E8DCC4] bg-transparent text-[#1F1A14] font-medium px-7 py-3.5 text-base transition-all duration-200 hover:bg-[#FAF6EE]"
              style={{ fontSize: "16px" }}
            >
              Explorar plataforma
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-[13px] text-[#9A9080]"
          >
            Sem cartão de crédito · Configuração em 2 minutos
          </motion.p>

          {/* Mockup */}
          <div className="mt-16 w-full" style={{ maxWidth: "760px" }}>
            <FloatingMockup>
              <DashboardMockup />
            </FloatingMockup>
          </div>
        </div>
      </Container>
    </section>
  );
}
