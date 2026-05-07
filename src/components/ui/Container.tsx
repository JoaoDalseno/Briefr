import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  /** "default" = max-w-7xl | "narrow" = max-w-3xl | "wide" = max-w-screen-2xl */
  size?: "narrow" | "default" | "wide"
  className?: string
  as?: React.ElementType
}

/**
 * Container responsivo com max-width e padding lateral padronizados.
 *
 * Uso:
 *   <Container>...</Container>
 *   <Container size="narrow" className="py-20">...</Container>
 */
export function Container({
  children,
  size = "default",
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "narrow"  && "max-w-3xl",
        size === "default" && "max-w-7xl",
        size === "wide"    && "max-w-screen-2xl",
        className
      )}
    >
      {children}
    </Tag>
  )
}
