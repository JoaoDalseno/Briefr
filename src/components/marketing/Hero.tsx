"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FloatingMockup } from "@/components/animations";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const HOOKS = [
  '"Ganhe 5kg de músculo em 30 dias"',
  '"O motivo pelo qual seu treino não funciona"',
  '"+12.000 brasileiros já transformaram o físico"',
];

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#E8DCC4] bg-white"
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06), 0 32px 80px rgba(0,0,0,0.1), 0 64px 120px rgba(194,65,12,0.05)",
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
            fontSize: "11px",
            color: "#9A9080",
            textAlign: "center",
            fontFamily: "monospace",
          }}
        >
          briefr.com.br/dashboard
        </div>
        <div style={{ color: "#C4B8A0", fontSize: 16, lineHeight: 1 }}>↻</div>
      </div>

      {/* App UI — two panels */}
      <div style={{ display: "flex", background: "#FAF6EE" }}>

        {/* Left: Form panel (35%) */}
        <div
          style={{
            background: "#FAF6EE",
            borderRight: "1px solid #E8DCC4",
            padding: "16px",
            width: "35%",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 600,
              color: "#9A9080",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            Novo Brief
          </div>

          {/* Produto — campo ativo */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#9A9080", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              Produto
            </div>
            <div
              style={{
                background: "white",
                border: "1px solid #C2410C",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "11px",
                color: "#1F1A14",
                boxShadow: "0 0 0 3px rgba(194,65,12,0.1)",
              }}
            >
              Suplemento Alpha Pro
            </div>
          </div>

          {/* Público */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#9A9080", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              Público-alvo
            </div>
            <div
              style={{
                background: "white",
                border: "1px solid #E8DCC4",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "11px",
                color: "#9A9080",
              }}
            >
              Homens 25–40 que treinam...
            </div>
          </div>

          {/* Formatos */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#9A9080", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              Formatos
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {(["Estático", "Story", "UGC"] as const).map((f, i) => (
                <span
                  key={f}
                  style={{
                    background: i === 0 ? "#C2410C" : "white",
                    color: i === 0 ? "white" : "#6B6258",
                    border: `1px solid ${i === 0 ? "#C2410C" : "#E8DCC4"}`,
                    borderRadius: "20px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: i === 0 ? 500 : 400,
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
              width: "100%",
              background: "#C2410C",
              color: "white",
              borderRadius: "8px",
              padding: "8px 0",
              fontSize: "11px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <span>Gerar brief</span>
            <span>→</span>
          </div>
        </div>

        {/* Right: Output panel (65%) */}
        <div style={{ padding: "16px", width: "65%", overflow: "hidden", background: "white" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E8DCC4", marginBottom: "14px" }}>
            {["Estático 1:1", "Story 9:16", "UGC 15s"].map((tab, i) => (
              <div
                key={tab}
                style={{
                  padding: "6px 10px",
                  fontSize: "10px",
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? "#C2410C" : "#9A9080",
                  borderBottom: i === 0 ? "2px solid #C2410C" : "2px solid transparent",
                  marginBottom: "-1px",
                  cursor: "pointer",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Headline */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 600, color: "#9A9080", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
              Headline
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#1F1A14", lineHeight: 1.4 }}>
              &quot;Ganhe 5kg de músculo em 30 dias&quot;
            </div>
          </div>

          <div style={{ height: "1px", background: "#F4E8D6", margin: "8px 0" }} />

          {/* Hooks */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 600, color: "#9A9080", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
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

          {/* CTA */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 600, color: "#9A9080", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              CTA
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "#C2410C",
                color: "white",
                borderRadius: "6px",
                padding: "5px 12px",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              Comprar com 40% OFF →
            </div>
          </div>

          <div style={{ height: "1px", background: "#F4E8D6", margin: "8px 0" }} />

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#9A9080", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
              CTR: 2.8–4.2%
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#C2410C", cursor: "pointer" }}>
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
              transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
            />
          </div>
        </div>
      </div>

      {/* Fade gradient at bottom */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
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
    <section className="relative overflow-x-hidden pt-20 pb-0 sm:pt-24">
      {/* Subtle radial bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(194,65,12,0.04) 0%, transparent 70%)",
        }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-0 lg:gap-12 items-center min-h-[100vh] py-16 lg:py-0">

          {/* ── Left: Text column ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: EASE }}
            >
              <span
                className="inline-flex items-center rounded-full border bg-[#FAF6EE] font-sans text-xs uppercase tracking-widest font-medium"
                style={{ borderColor: "#E8DCC4", color: "#9A3309", padding: "6px 16px" }}
              >
                ✦ Plataforma de Briefs com IA
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="font-display font-normal leading-[1.0] tracking-[-0.03em]"
              style={{ fontSize: "clamp(44px, 5vw, 72px)", maxWidth: "560px", marginTop: "20px" }}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            >
              <span style={{ color: "#1F1A14" }}>Briefs que convertem,</span>
              <br />
              <em className="font-display not-italic" style={{ color: "#C2410C", fontStyle: "italic" }}>
                em minutos.
              </em>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="font-sans"
              style={{
                fontSize: "18px",
                color: "#6B6258",
                maxWidth: "440px",
                lineHeight: 1.65,
                marginTop: "24px",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              Descreva seu produto e a IA monta o brief completo do anúncio —
              hook, copy, roteiro e referência visual. Em português, com contexto BR.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3"
              style={{ marginTop: "36px" }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            >
              <a
                href="#waitlist"
                className="inline-flex items-center font-sans font-medium transition-colors duration-200"
                style={{
                  background: "#C2410C",
                  color: "white",
                  borderRadius: "8px",
                  padding: "13px 28px",
                  fontSize: "15px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#9A3309")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#C2410C")}
              >
                Garantir minha vaga →
              </a>
              <a
                href="#how"
                className="inline-flex items-center font-sans font-medium transition-colors duration-200"
                style={{
                  border: "1px solid #E8DCC4",
                  background: "transparent",
                  color: "#1F1A14",
                  borderRadius: "8px",
                  padding: "13px 28px",
                  fontSize: "15px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF6EE")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Ver como funciona
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.p
              className="font-sans"
              style={{ fontSize: "13px", color: "#9A9080", marginTop: "20px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            >
              Beta fechado · Acesso por convite · Gratuito durante o beta
            </motion.p>
          </div>

          {/* ── Right: Mockup column ── */}
          <div
            className="relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
            style={{ overflow: "visible" }}
          >
            {/* Radial glow behind mockup */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "-40px",
                background:
                  "radial-gradient(ellipse 80% 70% at 60% 50%, rgba(194,65,12,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Mobile: no 3D tilt */}
            <div
              className="relative w-full lg:hidden"
              style={{ maxWidth: "100%", zIndex: 1, overflow: "hidden" }}
            >
              <FloatingMockup>
                <DashboardMockup />
              </FloatingMockup>
            </div>

            {/* Desktop: 3D tilt */}
            <div
              className="relative hidden lg:block w-full"
              style={{
                maxWidth: "580px",
                marginRight: "-48px",
                transform: "perspective(1200px) rotateY(-6deg) rotateX(2deg)",
                zIndex: 1,
              }}
            >
              <FloatingMockup>
                <DashboardMockup />
              </FloatingMockup>
            </div>
          </div>
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
