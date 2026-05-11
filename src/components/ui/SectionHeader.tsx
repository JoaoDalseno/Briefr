import { cn } from "@/lib/utils"
import { GradientText } from "@/components/ui/GradientText"

interface SectionHeaderProps {
  /** Pequeno texto acima do título (ex: "Novo", "Funcionalidades") */
  eyebrow?: string
  /** Título principal — aceita string ou ReactNode para usar GradientText parcial */
  title: React.ReactNode
  /** Subtítulo/descrição */
  subtitle?: React.ReactNode
  /** Alinhamento */
  align?: "left" | "center"
  /** Espaçamento inferior padrão */
  className?: string
  /** Aplica gradiente automático em todo o título (quando title é string) */
  gradient?: boolean
}

/**
 * Header de seção padronizado: eyebrow + título grande + subtítulo.
 *
 * Uso:
 *   <SectionHeader
 *     eyebrow="Como funciona"
 *     title="Briefs prontos em segundos"
 *     subtitle="Descreva seu produto e a IA gera o brief completo."
 *   />
 *
 *   // Com gradiente no título:
 *   <SectionHeader
 *     eyebrow="Planos"
 *     title="Escolha seu plano"
 *     gradient
 *   />
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  gradient = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        align === "left"   && "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <>
          <p className="font-mono text-[11px] text-[#9A9080] uppercase tracking-[0.08em]">
            — {eyebrow}
          </p>
          <div className="section-rule" />
        </>
      )}

      <h2
        className={cn(
          "font-serif font-normal tracking-[-0.02em] text-balance",
          "text-3xl sm:text-4xl lg:text-5xl",
          !gradient && "text-foreground"
        )}
      >
        {gradient && typeof title === "string" ? (
          <GradientText gradient="brand">{title}</GradientText>
        ) : (
          title
        )}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "text-muted-foreground text-balance leading-relaxed",
            "text-base sm:text-lg",
            align === "center" && "max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
