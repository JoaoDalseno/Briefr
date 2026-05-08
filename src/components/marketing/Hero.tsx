"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FloatingMockup } from "@/components/animations";

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

const HOOKS = [
  '"Ganhe 5kg de músculo em 30 dias"',
  '"O motivo pelo qual seu treino não está funcionando"',
  '"+12.000 brasileiros já transformaram o físico"',
];

function DashboardMockup() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#E8DCC4] bg-white"
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.06), 0 32px 64px rgba(0,0,0,0.08), 0 64px 120px rgba(194,65,12,0.04)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#F5F0E8",
          borderBottom: "1px solid #E8DCC4",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
        </div>
        <div
          style={{
            flex: 1,
            margin: "0 12px",
            background: "white",
            border: "1px solid #E8DCC4",
            borderRadius: "6px",
            padding: "4px 12px",
            fontSize: "12px",
            color: "#9A9080",
            textAlign: "center",
            fontFamily: "monospace",
          }}
        >
          briefr.com.br/dashboard
        </div>
        <div style={{ color: "#C4B8A0", fontSize: 16, lineHeight: 1 }}>↻</div>
      </div>

      {/* App UI — two panels side by side */}
      <div style={{ display: "flex", background: "#FAF6EE" }}>

        {/* ── Left: Form panel ── */}
        <div
          style={{
            background: "#FAF6EE",
            borderRight: "1px solid #E8DCC4",
            padding: "16px",
            width: "38%",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "10px", fontWeight: 600,
              color: "#9A9080", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: "14px",
            }}
          >
            Novo Brief
          </div>

          {/* Produto */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#9A9080", marginBottom: "4px" }}>Produto</div>
            <div
              style={{
                background: "white", border: "1px solid #C2410C",
                borderRadius: "6px", padding: "6px 10px",
                fontSize: "11px", color: "#1F1A14",
                boxShadow: "0 0 0 3px rgba(194,65,12,0.1)",
              }}
            >
              Suplemento Alpha Pro
            </div>
          </div>

          {/* Público */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#9A9080", marginBottom: "4px" }}>Público-alvo</div>
            <div
              style={{
                background: "white", border: "1px solid #E8DCC4",
                borderRadius: "6px", padding: "6px 10px",
                fontSize: "11px", color: "#6B6258",
              }}
            >
              Homens 25–40 que treinam...
            </div>
          </div>

          {/* Plataforma */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#9A9080", marginBottom: "4px" }}>Plataforma</div>
            <div
              style={{
                background: "white", border: "1px solid #E8DCC4",
                borderRadius: "6px", padding: "6px 10px",
                fontSize: "11px", color: "#1F1A14",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <span>Meta Ads</span>
              <span style={{ color: "#C4B8A0", fontSize: "10px" }}>▼</span>
            </div>
          </div>

          {/* Formatos */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "10px", color: "#9A9080", marginBottom: "6px" }}>Formatos</div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {(["Estático", "Story", "UGC"] as const).map((f, i) => (
                <span
                  key={f}
                  style={{
                    background: i === 0 ? "#C2410C" : "white",
                    color: i === 0 ? "white" : "#6B6258",
                    border: `1px solid ${i === 0 ? "#C2410C" : "#E8DCC4"}`,
                    borderRadius: "20px", padding: "2px 8px",
                    fontSize: "10px", fontWeight: i === 0 ? 500 : 400,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Botão */}
          <div
            style={{
              width: "100%", background: "#C2410C", color: "white",
              borderRadius: "8px", padding: "8px 0",
              fontSize: "11px", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "6px", cursor: "pointer",
            }}
          >
            <span>Gerar brief</span>
            <span>→</span>
          </div>
        </div>

        {/* ── Right: Output panel ── */}
        <div style={{ padding: "16px", width: "62%", overflow: "hidden", background: "white" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E8DCC4", marginBottom: "14px" }}>
            {["Estático 1:1", "Story 9:16", "UGC 15s"].map((tab, i) => (
              <div
                key={tab}
                style={{
                  padding: "6px 10px", fontSize: "10px",
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? "#C2410C" : "#9A9080",
                  borderBottom: i === 0 ? "2px solid #C2410C" : "2px solid transparent",
                  marginBottom: "-1px", cursor: "pointer",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Headline */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#9A9080", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
              Headline
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#1F1A14", lineHeight: 1.4 }}>
              &quot;Ganhe 5kg de músculo em 30 dias&quot;
            </div>
          </div>

          <div style={{ height: "1px", background: "#F4E8D6", margin: "8px 0" }} />

          {/* Hooks */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#9A9080", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              Hooks (3 opções)
            </div>
            {HOOKS.map((hook, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "4px" }}>
                <span style={{ color: "#C2410C", fontWeight: 700, fontSize: "10px", minWidth: "14px", marginTop: "1px" }}>
                  {i + 1}.
                </span>
                <span style={{ fontSize: "10px", color: "#4A4238", lineHeight: 1.5 }}>{hook}</span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "#F4E8D6", margin: "8px 0" }} />

          {/* Copy */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#9A9080", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
              Copy
            </div>
            <div style={{ fontSize: "10px", color: "#6B6258", lineHeight: 1.6 }}>
              Whey isolado com absorção 3× mais rápida. +12.000 clientes no Brasil. Frete grátis hoje.
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "#9A9080", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              CTA
            </div>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "#C2410C", color: "white",
                borderRadius: "6px", padding: "5px 12px",
                fontSize: "10px", fontWeight: 500,
              }}
            >
              Comprar com 40% OFF →
            </div>
          </div>

          <div style={{ height: "1px", background: "#F4E8D6", margin: "8px 0" }} />

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "9px", color: "#9A9080", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
              CTR estimado: 2.8–4.2%
            </div>
            <div style={{ fontSize: "9px", color: "#C2410C", fontWeight: 500, cursor: "pointer" }}>
              Exportar PDF →
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "8px", height: "2px", background: "#F4E8D6", borderRadius: "1px", overflow: "hidden" }}>
            <motion.div
              style={{
                height: "100%",
                background: "linear-gradient(to right, #C2410C, #E87445)",
                borderRadius: "1px",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "73%" }}
              transition={{ duration: 1.5, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Fade gradient at bottom */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "80px",
          background: "linear-gradient(to bottom, transparent, #FFFCF5)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative overflow-x-hidden bg-[#FFFCF5] pt-20 pb-0 sm:pt-24">
      {/* Radial glow behind mockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(194,65,12,0.04) 0%, transparent 70%)",
        }}
      />

      <Container>
        {/* Split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-0 lg:gap-12 items-center min-h-[90vh] py-16 lg:py-0">

          {/* ── Left: Text ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="inline-flex items-center rounded-full border border-[#E8DCC4] bg-[#FAF6EE] px-4 py-1.5 text-[13px] font-medium text-[#9A3309]">
                ✦ Plataforma de Briefs de Criativos com IA
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="mt-5 font-semibold leading-[1.05] tracking-[-0.03em]"
              style={{ fontSize: "clamp(40px, 5vw, 60px)", maxWidth: "560px" }}
            >
              Briefs que convertem,
              <br />
              <span style={{ color: "#C2410C" }}>em minutos.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="mt-5 text-[#6B6258] leading-relaxed"
              style={{ fontSize: "19px", maxWidth: "440px" }}
            >
              Descreva seu produto e a IA monta o brief completo do anúncio —
              hook, copy, roteiro e referência visual. Em português, com contexto
              BR.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="mt-8 flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 rounded-full bg-[#C2410C] text-white font-medium px-7 py-3.5 text-base transition-all duration-200 hover:bg-[#9A3309] hover:scale-[1.02] active:scale-[0.98]"
                style={{ fontSize: "16px" }}
              >
                Garantir minha vaga
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center rounded-full border border-[#E8DCC4] bg-transparent text-[#1F1A14] font-medium px-7 py-3.5 text-base transition-all duration-200 hover:bg-[#FAF6EE]"
                style={{ fontSize: "16px" }}
              >
                Ver como funciona
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 text-[13px] text-[#9A9080]"
            >
              Beta fechado · Acesso por convite · Gratuito durante o beta
            </motion.p>
          </div>

          {/* ── Right: Mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
            style={{ overflow: "visible" }}
          >
            {/* Radial glow behind mockup */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "-40px",
                background: "radial-gradient(ellipse 70% 70% at 60% 50%, rgba(194,65,12,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Mobile: no 3D tilt */}
            <div
              className="relative w-full lg:hidden"
              style={{ maxWidth: "560px", zIndex: 1 }}
            >
              <FloatingMockup>
                <DashboardMockup />
              </FloatingMockup>
            </div>

            {/* Desktop: 3D tilt + bleed right */}
            <div
              className="relative hidden lg:block w-full"
              style={{
                maxWidth: "640px",
                marginRight: "-48px",
                transform: "perspective(1200px) rotateY(-6deg) rotateX(3deg)",
                zIndex: 1,
              }}
            >
              <FloatingMockup>
                <DashboardMockup />
              </FloatingMockup>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Section separator */}
      <div
        aria-hidden
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, #E8DCC4 30%, #E8DCC4 70%, transparent)",
        }}
      />
    </section>
  );
}
