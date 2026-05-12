"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FloatingMockup } from "@/components/animations";

const EASE = [0.25, 0.1, 0.25, 1] as const;

// ─── Animated Mockup ──────────────────────────────────────────────────────────

function AnimatedMockup() {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mockBody = bodyRef.current;
    if (!mockBody) return;
    const mb: HTMLElement = mockBody;

    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    // Typewriter: walks text nodes so inline HTML stays intact
    type TwNode = { node: Text; full: string };
    function prepareTypewipe(el: HTMLElement) {
      const nodes: TwNode[] = [];
      function walk(n: Node) {
        n.childNodes.forEach((c) => {
          if (c.nodeType === Node.TEXT_NODE) {
            nodes.push({ node: c as Text, full: (c as Text).nodeValue ?? "" });
          } else if (c.nodeType === Node.ELEMENT_NODE) {
            walk(c);
          }
        });
      }
      walk(el);
      (el as HTMLElement & { __tw?: TwNode[] }).__tw = nodes;
    }
    function clearTypewipe(el: HTMLElement) {
      const e = el as HTMLElement & { __tw?: TwNode[] };
      if (!e.__tw) prepareTypewipe(el);
      e.__tw!.forEach((n) => (n.node.nodeValue = ""));
    }
    async function typeText(
      el: HTMLElement,
      opts: { base?: number; jitter?: number; pComma?: number; pPeriod?: number } = {}
    ) {
      if (cancelled) return;
      const { base = 26, jitter = 16, pComma = 90, pPeriod = 180 } = opts;
      const e = el as HTMLElement & { __tw?: TwNode[] };
      if (!e.__tw) prepareTypewipe(el);
      clearTypewipe(el);
      el.classList.add("is-typing");
      for (const seg of e.__tw!) {
        for (let i = 1; i <= seg.full.length; i++) {
          if (cancelled) return;
          seg.node.nodeValue = seg.full.slice(0, i);
          const ch = seg.full[i - 1];
          let d = base + (Math.random() * jitter - jitter / 2);
          if (",;".includes(ch)) d += pComma;
          if (".!?".includes(ch)) d += pPeriod;
          if (ch === "\u2014") d += 60; // em dash
          await wait(d);
        }
      }
      el.classList.remove("is-typing");
    }

    // Count-up animation
    function countUp(el: HTMLElement) {
      const target = parseFloat(el.dataset.target ?? "0");
      const dec = parseInt(el.dataset.decimals ?? "0", 10);
      const pre = el.dataset.prefix ?? "";
      const suf = el.dataset.suffix ?? "";
      const dur = 850;
      const t0 = performance.now();
      function frame(t: number) {
        if (cancelled) return;
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + (target * eased).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    function resetMetrics() {
      mb.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const pre = el.dataset.prefix ?? "";
        const suf = el.dataset.suffix ?? "";
        const dec = parseInt(el.dataset.decimals ?? "0", 10);
        el.textContent = pre + (0).toFixed(dec) + suf;
      });
    }

    const get = (k: string) =>
      Array.from(mb.querySelectorAll<HTMLElement>(`[data-anim="${k}"]`));

    const on = (k: string) => get(k).forEach((el) => el.classList.add("is-on"));
    const off = (k: string) => get(k).forEach((el) => el.classList.remove("is-on"));

    function rowOf(key: string) {
      const el = mb.querySelector<HTMLElement>(`[data-anim="${key}"]`);
      return el?.closest<HTMLElement>(".mockup-row") ?? null;
    }
    async function focusRow(key: string) {
      mb.querySelectorAll(".mockup-row.is-active").forEach((el) => el.classList.remove("is-active"));
      rowOf(key)?.classList.add("is-active");
      await wait(140);
    }

    const typewipes = Array.from(mb.querySelectorAll<HTMLElement>(".typewipe"));
    typewipes.forEach(prepareTypewipe);

    const formatoRow = mb.querySelector<HTMLElement>(".mockup__chips")?.closest<HTMLElement>(".mockup-row");
    const genBtn = mb.querySelector<HTMLElement>(".mockup-generate");

    function reset() {
      mb.querySelectorAll(".is-on").forEach((el) => el.classList.remove("is-on"));
      mb.querySelectorAll(".mockup-row.is-active").forEach((el) => el.classList.remove("is-active"));
      typewipes.forEach(clearTypewipe);
      genBtn?.classList.remove("is-ready", "is-click");
      resetMetrics();
    }

    async function loop() {
      while (!cancelled) {
        reset();
        await wait(600);

        await focusRow("produto");
        await typeText(mb.querySelector<HTMLElement>('[data-anim="produto"]')!, { base: 22, jitter: 14 });
        await wait(220);

        await focusRow("promessa");
        await typeText(mb.querySelector<HTMLElement>('[data-anim="promessa"]')!, { base: 30, jitter: 18, pComma: 120, pPeriod: 200 });
        await wait(240);

        if (formatoRow) {
          formatoRow.classList.remove("is-active");
          formatoRow.classList.add("is-active");
          const chips = get("formato");
          for (const chip of chips) {
            if (cancelled) return;
            await wait(110);
            chip.classList.add("is-on");
          }
          await wait(360);
        }

        await focusRow("publico");
        await typeText(mb.querySelector<HTMLElement>('[data-anim="publico"]')!, { base: 24, jitter: 14 });
        await wait(260);

        mb.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
        genBtn?.classList.add("is-ready");
        await wait(420);
        genBtn?.classList.add("is-click");
        await wait(260);

        on("loading");
        await wait(1150);
        off("loading");
        await wait(80);

        on("brief-head");
        await wait(360);

        on("brief-hook");
        await wait(180);
        const hookEl = mb.querySelector<HTMLElement>(".brief-hook .typewipe");
        if (hookEl) await typeText(hookEl, { base: 36, jitter: 18, pComma: 140, pPeriod: 220 });
        await wait(380);

        on("brief-roteiro");
        await wait(240);
        for (const line of ["brief-roteiro-1", "brief-roteiro-2", "brief-roteiro-3", "brief-roteiro-4"]) {
          if (cancelled) return;
          on(line);
          await wait(200);
        }
        await wait(220);

        on("brief-metrics");
        await wait(180);
        mb.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => countUp(el));

        await wait(4200);

        mb.style.transition = "opacity 520ms ease";
        mb.style.opacity = "0";
        await wait(540);
        if (cancelled) return;
        reset();
        mb.style.opacity = "1";
        mb.style.transition = "";
        await wait(180);
      }
    }

    let started = false;
    const startOnce = () => {
      if (started || cancelled) return;
      started = true;
      loop();
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { startOnce(); io.disconnect(); } }),
        { threshold: 0.15 }
      );
      io.observe(mb);
      return () => { cancelled = true; io.disconnect(); };
    } else {
      startOnce();
      return () => { cancelled = true; };
    }
  }, []);

  return (
    <div className="mockup-shell">
      {/* Browser chrome */}
      <div className="mockup-chrome">
        <div className="mockup-lights">
          <span style={{ background: "#FF5F56" }} />
          <span style={{ background: "#FFBD2E" }} />
          <span style={{ background: "#27C93F" }} />
        </div>
        <div className="mockup-url">briefr.com.br / novo-brief</div>
      </div>

      {/* Body — animation drives this after mount */}
      <div ref={bodyRef} className="mockup-body">
        {/* Form pane */}
        <div className="mockup-form">
          <div className="mockup-row">
            <div className="mockup-label">Produto</div>
            <div className="mockup-field">
              <span className="typewipe" data-anim="produto">Whey Protein Iso — 900g</span>
            </div>
          </div>
          <div className="mockup-row">
            <div className="mockup-label">Promessa</div>
            <div className="mockup-field mockup-field--multi">
              <span className="typewipe" data-anim="promessa">
                <b>Ganhe 5kg de músculo em 30 dias</b>, sem dieta restritiva.
              </span>
            </div>
          </div>
          <div className="mockup-row">
            <div className="mockup-label">Formato</div>
            <div className="mockup__chips">
              <span className="mockup-chip is-active" data-anim="formato">Story 9:16</span>
              <span className="mockup-chip" data-anim="formato">UGC 15s</span>
              <span className="mockup-chip" data-anim="formato">Estático</span>
            </div>
          </div>
          <div className="mockup-row">
            <div className="mockup-label">Público</div>
            <div className="mockup-field">
              <span className="typewipe" data-anim="publico">Homens 25-40, hipertrofia</span>
            </div>
          </div>
          <button className="mockup-generate" type="button" data-anim="btn">
            <span>Gerar brief</span>
            <span>↗</span>
          </button>
        </div>

        {/* Brief preview pane */}
        <div className="mockup-brief">
          <div className="brief-generating" data-anim="loading">
            <div className="brief-generating-bar"><span /></div>
            <div className="brief-generating-text">
              Gerando brief
              <span className="brief-dots"><i>.</i><i>.</i><i>.</i></span>
            </div>
          </div>

          <div className="brief-section brief-head anim-fade" data-anim="brief-head">
            <div className="brief-title">Brief <em>#0421</em> · Whey Iso</div>
            <div className="brief-meta">gerado em 1m 47s</div>
          </div>

          <div className="brief-section anim-fade" data-anim="brief-hook">
            <h5 className="brief-h5">Hook principal</h5>
            <div className="brief-hook">
              <span className="typewipe">
                &ldquo;Se você treina pesado mas não cresce,<br />
                o problema <em>não é o treino.</em>&rdquo;
              </span>
            </div>
          </div>

          <div className="brief-section anim-fade" data-anim="brief-roteiro">
            <h5 className="brief-h5">Roteiro · 15s UGC</h5>
            <ul className="brief-list">
              <li className="anim-fade" data-anim="brief-roteiro-1">0-3s · Close no rosto, hook direto</li>
              <li className="anim-fade" data-anim="brief-roteiro-2">3-8s · Mostrar produto + benefício</li>
              <li className="anim-fade" data-anim="brief-roteiro-3">8-12s · Antes/depois com cliente real</li>
              <li className="anim-fade" data-anim="brief-roteiro-4">12-15s · CTA: &ldquo;Garante o seu hoje&rdquo;</li>
            </ul>
          </div>

          <div className="brief-section anim-fade" data-anim="brief-metrics">
            <h5 className="brief-h5">Métricas esperadas</h5>
            <div className="brief-metrics">
              <div className="brief-metric">
                <div className="brief-metric-v" data-count data-target="2.8" data-suffix="%" data-decimals="1">0%</div>
                <div className="brief-metric-l">CTR</div>
              </div>
              <div className="brief-metric">
                <div className="brief-metric-v" data-count data-target="14" data-prefix="R$ " data-decimals="0">R$ 0</div>
                <div className="brief-metric-l">CPA</div>
              </div>
              <div className="brief-metric">
                <div className="brief-metric-v" data-count data-target="3.2" data-suffix="x" data-decimals="1">0x</div>
                <div className="brief-metric-l">ROAS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative overflow-x-hidden pt-20 pb-0 sm:pt-24">
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

          {/* Left: copy */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: EASE }}
            >
              <span
                className="inline-flex items-center rounded-full border bg-[#FAF6EE] font-sans text-xs uppercase tracking-widest font-medium"
                style={{ borderColor: "#E8DCC4", color: "#9A3309", padding: "6px 16px" }}
              >
                ✦ Plataforma de briefs com IA
              </span>
            </motion.div>

            <motion.h1
              className="font-display font-normal leading-[1.08] tracking-[-0.01em]"
              style={{ fontSize: "clamp(40px, 6.2vw, 72px)", maxWidth: "560px", marginTop: "20px" }}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            >
              <span style={{ color: "#1F1A14" }}>Briefs que convertem,</span>
              <br />
              <em style={{ color: "#C2410C", fontStyle: "italic" }}>em minutos.</em>
            </motion.h1>

            <motion.p
              className="font-sans"
              style={{ fontSize: "18px", color: "#6B6258", maxWidth: "440px", lineHeight: 1.65, marginTop: "24px" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              A primeira plataforma brasileira que transforma um produto em um
              brief criativo completo — hook, roteiro, métricas e direção visual —
              pronto para o designer rodar.
            </motion.p>

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
                style={{ background: "#C2410C", color: "white", borderRadius: "8px", padding: "13px 28px", fontSize: "15px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#9A3309")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#C2410C")}
              >
                Garantir minha vaga →
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center font-sans font-medium transition-colors duration-200"
                style={{ border: "1px solid #E8DCC4", background: "transparent", color: "#1F1A14", borderRadius: "8px", padding: "13px 28px", fontSize: "15px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF6EE")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Ver como funciona
              </a>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            >
              <div className="flex -space-x-2" aria-hidden>
                {["R", "L", "M", "J"].map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center justify-center rounded-full border-2 border-[#FFFCF5] text-white font-sans font-semibold"
                    style={{ width: 28, height: 28, fontSize: 11, background: "#C2410C" }}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <span className="font-sans text-[13px] text-[#6B6258]">
                + 312 gestores de tráfego na lista de espera
              </span>
            </motion.div>
          </div>

          {/* Right: mockup */}
          <div className="relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0" style={{ overflow: "visible" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "-40px",
                background: "radial-gradient(ellipse 80% 70% at 60% 50%, rgba(194,65,12,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div className="relative w-full lg:hidden" style={{ maxWidth: "100%", zIndex: 1 }}>
              <FloatingMockup><AnimatedMockup /></FloatingMockup>
            </div>
            <div
              className="relative hidden lg:block w-full"
              style={{ maxWidth: "580px", marginRight: "-48px", transform: "perspective(1200px) rotateY(-6deg) rotateX(2deg)", zIndex: 1 }}
            >
              <FloatingMockup><AnimatedMockup /></FloatingMockup>
            </div>
          </div>
        </div>
      </Container>

      <div
        aria-hidden
        style={{ height: "1px", background: "linear-gradient(to right, transparent, #E8DCC4 30%, #E8DCC4 70%, transparent)" }}
      />
    </section>
  );
}
