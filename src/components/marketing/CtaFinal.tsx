import { Container } from '@/components/ui/Container'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function CtaFinal() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Dark gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#3D1A08] via-[#2C1206] to-[#1F1A14]"
      />

      {/* Glow orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <Container size="narrow" className="relative z-10 flex flex-col items-center text-center gap-6">
        {/* Eyebrow */}
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
          Beta fechado · Acesso por convite
        </span>

        {/* Headline */}
        <h2 className="font-heading font-bold tracking-heading text-4xl sm:text-5xl lg:text-6xl text-balance text-white leading-tight">
          Pare de improvisar{' '}
          <span className="bg-gradient-to-r from-[#FCC9A8] to-[#99F6E4] bg-clip-text text-transparent">
            briefs hoje.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/65 max-w-xl text-balance leading-relaxed">
          Junte-se aos primeiros gestores de tráfego usando IA para acelerar a criação de criativos no Brasil.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <a
            href="#waitlist"
            className={cn(
              buttonVariants({ size: 'xl' }),
              'bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all'
            )}
          >
            Entrar na lista de espera →
          </a>
          <a
            href="#how"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'xl' }),
              'border border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm'
            )}
          >
            Ver como funciona
          </a>
        </div>

        {/* Microcopy */}
        <p className="text-xs text-white/45 mt-1">
          Gratuito durante o beta&nbsp;·&nbsp;Acesso por convite
        </p>
      </Container>
    </section>
  )
}
