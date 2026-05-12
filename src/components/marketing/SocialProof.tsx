import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animations";

export default function SocialProof() {
  return (
    <section className="py-20 bg-[#FAF6EE]">
      <Container size="narrow">
        <FadeUp>
          <div className="rounded-2xl border border-[#E8DCC4] bg-white p-8 sm:p-12">
            <div
              aria-hidden
              className="text-[80px] leading-none font-display text-[#C2410C] opacity-15 select-none -mb-4"
            >
              &ldquo;
            </div>
            <blockquote className="text-lg sm:text-xl text-[#1F1A14] leading-relaxed font-display font-normal mt-2">
              Antes eu levava <em className="not-italic font-display italic text-[#C2410C]">uma manhã</em> escrevendo brief, hoje rodo três criativos
              na hora do café. O time de design parou de me odiar — e a conta finalmente
              bate <em className="not-italic font-display italic text-[#C2410C]">3× de ROAS</em> sem improviso.
            </blockquote>
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#E8DCC4]">
              <div className="size-10 rounded-full bg-[#C2410C] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white font-sans">RC</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F1A14] font-sans">Rafaela Coutinho</p>
                <p className="text-xs text-[#6B6258] font-sans">Head de Tráfego · Verdi Suplementos</p>
              </div>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
