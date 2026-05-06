import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "default" | "white" | "mono"
  className?: string
  /** Exibe apenas o ícone, sem o texto */
  iconOnly?: boolean
}

const sizeMap = {
  xs: { icon: 18, text: "text-base",  gap: "gap-1.5" },
  sm: { icon: 22, text: "text-lg",    gap: "gap-2" },
  md: { icon: 28, text: "text-xl",    gap: "gap-2.5" },
  lg: { icon: 36, text: "text-2xl",   gap: "gap-3" },
}

export function Logo({ size = "md", variant = "default", className, iconOnly = false }: LogoProps) {
  // eslint-disable-next-line security/detect-object-injection
  const { icon, text, gap } = sizeMap[size]

  const iconColor =
    variant === "white"  ? "oklch(0.98 0 0)" :
    variant === "mono"   ? "currentColor" :
    "oklch(0.563 0.196 271.2)"  // primary purple

  const textColor =
    variant === "white"  ? "text-white" :
    variant === "mono"   ? "text-current" :
    "text-foreground"

  return (
    <span className={cn("inline-flex items-center font-heading font-semibold tracking-tight", gap, className)}>
      {/* Ícone: raio estilizado */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {/* Gradiente interno */}
        <defs>
          <linearGradient id="briefr-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="oklch(0.563 0.196 271.2)" />
            <stop offset="100%" stopColor="oklch(0.724 0.188 19.8)" />
          </linearGradient>
        </defs>
        {/* Fundo arredondado */}
        <rect
          x="1" y="1" width="22" height="22" rx="7"
          fill={variant === "default" ? "url(#briefr-logo-grad)" : iconColor}
          opacity={variant === "white" ? "0.15" : "1"}
        />
        {/* Raio/bolt */}
        <path
          d="M13.5 3L6 13.5h6L9.5 21 18 10.5h-6L13.5 3z"
          fill="white"
          strokeLinejoin="round"
        />
      </svg>

      {!iconOnly && (
        <span className={cn("font-bold tracking-heading", text, textColor)}>
          Briefr
        </span>
      )}
    </span>
  )
}
