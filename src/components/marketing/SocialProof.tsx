import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animations";

export default function SocialProof() {
  return (
    <section className="py-20 bg-[#FAF6EE]">
      <Container size="narrow">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F1A14] leading-tight">
            Como gestores de tráfego{" "}
            <span className="block">ganham tempo com o Briefr.</span>
          </h2>
          <p className="mt-4 text-base text-[#6B6258] max-w-xl mx-auto leading-relaxed">
            Ao usar briefs estruturados pela IA, gestores eliminam idas e
            vindas com designers e entregam criativos mais rápido para os
            clientes.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="rounded-2xl border border-[#E8DCC4] bg-white p-8 sm:p-10 space-y-6">
            {/* Quote mark */}
            <div
              aria-hidden
              className="text-[64px] leading-none font-serif text-[#C2410C]/20 select-none -mb-2"
            >
              &ldquo;
            </div>

            <p className="text-lg sm:text-xl text-[#1F1A14] leading-relaxed font-medium">
              Antes eu levava 1 hora pra montar um brief decente. Agora gero em
              2 minutos e o brief é melhor — com hook, copy e direção visual
              que meu designer consegue executar direto.
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-[#E8DCC4]">
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="size-10 rounded-full bg-[#C2410C]/10 border border-[#E8DCC4] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#C2410C]">JV</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F1A14]">
                    João Victor
                  </p>
                  <p className="text-xs text-[#6B6258]">
                    Gestor de Tráfego — São Paulo
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-[#C2410C]/8 border border-[#C2410C]/20 px-3 py-1 text-xs font-semibold text-[#9A3309]">
                Beta tester
              </span>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-8 text-center">
          <Link
            href="/beta"
            className="text-sm font-semibold text-[#C2410C] hover:text-[#9A3309] transition-colors"
          >
            Entrar na lista beta →
          </Link>
        </FadeUp>
      </Container>
    </section>
  );
}
