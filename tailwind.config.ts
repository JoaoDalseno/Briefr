import type { Config } from "tailwindcss";

// Briefr Design System — Tailwind Config
// Para opacity modifiers (bg-primary/8, outline-ring/50) funcionar no Tailwind v3,
// as cores são definidas com <alpha-value> usando variáveis de canal separadas
// (--primary-ch, --ring-ch, etc.) definidas em globals.css.
//
// Primary:   #6C63E0 → oklch(0.563 0.196 271.2)
// Secondary: #1A1A2E → oklch(0.154 0.032 264.4)
// Accent:    #FF6B6B → oklch(0.724 0.188 19.8)

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Tokens base — channel vars para suporte a opacity
        background: "oklch(var(--background-ch) / <alpha-value>)",
        foreground: "oklch(var(--foreground-ch) / <alpha-value>)",

        card: {
          DEFAULT:    "oklch(var(--card-ch) / <alpha-value>)",
          foreground: "oklch(var(--card-fg-ch) / <alpha-value>)",
        },
        popover: {
          DEFAULT:    "oklch(var(--popover-ch) / <alpha-value>)",
          foreground: "oklch(var(--popover-fg-ch) / <alpha-value>)",
        },
        muted: {
          DEFAULT:    "oklch(var(--muted-ch) / <alpha-value>)",
          foreground: "oklch(var(--muted-fg-ch) / <alpha-value>)",
        },
        border:      "oklch(var(--border-ch) / <alpha-value>)",
        input:       "oklch(var(--input-ch) / <alpha-value>)",
        ring:        "oklch(var(--ring-ch) / <alpha-value>)",
        destructive: {
          DEFAULT:    "oklch(var(--destructive-ch) / <alpha-value>)",
          foreground: "oklch(0.98 0 0 / <alpha-value>)",
        },

        // Briefr primary — roxo elétrico #6C63E0
        primary: {
          DEFAULT:    "oklch(var(--primary-ch) / <alpha-value>)",
          foreground: "oklch(0.98 0 0 / <alpha-value>)",
          50:  "oklch(0.967 0.017 271.2 / <alpha-value>)",
          100: "oklch(0.928 0.042 271.2 / <alpha-value>)",
          200: "oklch(0.871 0.079 271.2 / <alpha-value>)",
          300: "oklch(0.782 0.123 271.2 / <alpha-value>)",
          400: "oklch(0.680 0.163 271.2 / <alpha-value>)",
          500: "oklch(0.563 0.196 271.2 / <alpha-value>)", // #6C63E0
          600: "oklch(0.494 0.196 271.2 / <alpha-value>)",
          700: "oklch(0.420 0.182 271.2 / <alpha-value>)",
          800: "oklch(0.341 0.154 271.2 / <alpha-value>)",
          900: "oklch(0.253 0.112 271.2 / <alpha-value>)",
        },

        // Briefr secondary — azul-escuro #1A1A2E
        secondary: {
          DEFAULT:    "oklch(var(--secondary-ch) / <alpha-value>)",
          foreground: "oklch(var(--secondary-fg-ch) / <alpha-value>)",
          50:  "oklch(0.966 0.006 264.4 / <alpha-value>)",
          100: "oklch(0.929 0.013 264.4 / <alpha-value>)",
          200: "oklch(0.863 0.020 264.4 / <alpha-value>)",
          300: "oklch(0.741 0.024 264.4 / <alpha-value>)",
          400: "oklch(0.574 0.027 264.4 / <alpha-value>)",
          500: "oklch(0.398 0.030 264.4 / <alpha-value>)",
          600: "oklch(0.296 0.031 264.4 / <alpha-value>)",
          700: "oklch(0.231 0.032 264.4 / <alpha-value>)",
          800: "oklch(0.188 0.032 264.4 / <alpha-value>)",
          900: "oklch(0.154 0.032 264.4 / <alpha-value>)", // #1A1A2E
        },

        // Briefr accent — coral #FF6B6B
        accent: {
          DEFAULT:    "oklch(var(--accent-ch) / <alpha-value>)",
          foreground: "oklch(0.98 0 0 / <alpha-value>)",
          50:  "oklch(0.970 0.015 19.8 / <alpha-value>)",
          100: "oklch(0.936 0.038 19.8 / <alpha-value>)",
          200: "oklch(0.882 0.075 19.8 / <alpha-value>)",
          300: "oklch(0.817 0.118 19.8 / <alpha-value>)",
          400: "oklch(0.776 0.155 19.8 / <alpha-value>)",
          500: "oklch(0.724 0.188 19.8 / <alpha-value>)", // #FF6B6B
          600: "oklch(0.655 0.188 19.8 / <alpha-value>)",
          700: "oklch(0.559 0.177 19.8 / <alpha-value>)",
          800: "oklch(0.455 0.152 19.8 / <alpha-value>)",
          900: "oklch(0.352 0.115 19.8 / <alpha-value>)",
        },
      },

      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "Cascadia Code", "monospace"],
      },

      borderRadius: {
        none:    "0",
        sm:      "calc(var(--radius) - 4px)",
        DEFAULT: "var(--radius)",
        md:      "var(--radius)",
        lg:      "calc(var(--radius) + 4px)",
        xl:      "calc(var(--radius) + 8px)",
        "2xl":   "calc(var(--radius) + 12px)",
        full:    "9999px",
      },

      boxShadow: {
        "glow-xs":     "0 0 8px  oklch(0.563 0.196 271.2 / 0.20)",
        "glow-sm":     "0 0 14px oklch(0.563 0.196 271.2 / 0.25)",
        glow:          "0 0 24px oklch(0.563 0.196 271.2 / 0.30)",
        "glow-lg":     "0 0 40px oklch(0.563 0.196 271.2 / 0.35)",
        "glow-accent": "0 0 20px oklch(0.724 0.188 19.8 / 0.35)",
        glass:         "0 4px 24px oklch(0 0 0 / 0.06), inset 0 1px 0 oklch(1 0 0 / 0.10)",
        "glass-lg":    "0 8px 40px oklch(0 0 0 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.12)",
        card:          "0 4px 12px oklch(0 0 0 / 0.05), 0 1px 3px oklch(0 0 0 / 0.08)",
        "card-lg":     "0 8px 24px oklch(0 0 0 / 0.06), 0 2px 6px oklch(0 0 0 / 0.08)",
        "card-sm":     "0 1px 3px oklch(0 0 0 / 0.04), 0 1px 2px oklch(0 0 0 / 0.06)",
      },

      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, oklch(0.563 0.196 271.2), oklch(0.680 0.163 271.2))",
        "gradient-brand":   "linear-gradient(135deg, oklch(0.563 0.196 271.2), oklch(0.724 0.188 19.8))",
        "gradient-brand-r": "linear-gradient(135deg, oklch(0.724 0.188 19.8), oklch(0.563 0.196 271.2))",
        "gradient-dark":    "linear-gradient(135deg, oklch(0.154 0.032 264.4), oklch(0.231 0.032 264.4))",
        "gradient-subtle":  "linear-gradient(160deg, oklch(0.967 0.017 271.2), oklch(0.970 0.015 19.8))",
      },

      letterSpacing: {
        heading: "-0.02em",
        tight:   "-0.015em",
      },

      animation: {
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        progress:     "progress 20s ease-in-out forwards",
      },

      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 14px oklch(0.563 0.196 271.2 / 0.25)" },
          "50%":      { boxShadow: "0 0 28px oklch(0.563 0.196 271.2 / 0.45)" },
        },
        progress: {
          "0%":   { width: "0%" },
          "100%": { width: "95%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
