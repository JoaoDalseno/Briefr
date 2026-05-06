import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  /** "brand" = roxo→coral | "primary" = roxo→roxo claro */
  gradient?: "brand" | "primary"
  className?: string
  as?: "span" | "h1" | "h2" | "h3" | "p"
}

/**
 * Texto com gradiente roxo→coral (brand) ou roxo→roxo-claro (primary).
 * Usado em headings principais da landing page e dashboard.
 *
 * Uso:
 *   <GradientText gradient="brand" as="h1" className="text-5xl font-bold">
 *     Crie briefs incríveis
 *   </GradientText>
 */
export function GradientText({
  children,
  gradient = "brand",
  className,
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        gradient === "brand"    && "text-gradient-brand",
        gradient === "primary"  && "text-gradient-primary",
        className
      )}
    >
      {children}
    </Tag>
  )
}
