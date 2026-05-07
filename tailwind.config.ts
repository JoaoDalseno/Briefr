import type { Config } from "tailwindcss";

// Briefr Design System — Tailwind Config v2
// Paleta: Terracota + Bege quente
//
// Primary:    #C2410C (terracota.600) → HSL 17 89% 41%
// Accent:     #0F766E (petróleo.600)  → HSL 174 77% 26%
// Background: #FFFCF5 (stone.50)     → HSL 36 100% 98%
// Foreground: #1F1A14 (stone.900)    → HSL 30 25% 10%
//
// Semantic tokens usam CSS variables HSL para suporte a opacity modifiers:
//   bg-primary/50 → hsl(var(--primary) / 0.5)

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
        // ── Semantic tokens (driven by CSS variables, HSL pattern) ──────────
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface:    "hsl(var(--surface) / <alpha-value>)",

        card: {
          DEFAULT:    "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input:  "hsl(var(--input) / <alpha-value>)",
        ring:   "hsl(var(--ring) / <alpha-value>)",

        // ── Terracota — primária, marca, CTAs ────────────────────────────────
        terracota: {
          50:  "#FFF7F2",
          100: "#FFE6D5",
          200: "#FCC9A8",
          300: "#F4A176",
          400: "#E87445",
          500: "#D55A2B",
          600: "#C2410C",
          700: "#9A3309",
          800: "#7A2A0A",
          900: "#5C1F08",
        },

        // ── Petróleo — acento, links, contraste ──────────────────────────────
        petroleo: {
          50:  "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0F766E",
          700: "#115E59",
          800: "#0A4A44",
          900: "#063431",
        },

        // ── Stone — neutros, fundos, textos ──────────────────────────────────
        stone: {
          50:  "#FFFCF5",
          100: "#FAF6EE",
          200: "#F4E8D6",
          300: "#E8DCC4",
          400: "#C4B8A0",
          500: "#9A9080",
          600: "#6B6258",
          700: "#4A4238",
          800: "#2C2620",
          900: "#1F1A14",
        },
      },

      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "Cascadia Code", "monospace"],
      },

      borderRadius: {
        none:    "0",
        sm:      "calc(var(--radius) - 2px)",
        DEFAULT: "var(--radius)",
        md:      "var(--radius)",
        lg:      "calc(var(--radius) + 2px)",
        xl:      "calc(var(--radius) + 4px)",
        "2xl":   "calc(var(--radius) + 8px)",
        full:    "9999px",
      },

      boxShadow: {
        "glow-xs":     "0 0 8px  hsl(17 89% 41% / 0.20)",
        "glow-sm":     "0 0 14px hsl(17 89% 41% / 0.25)",
        glow:          "0 0 24px hsl(17 89% 41% / 0.30)",
        "glow-lg":     "0 0 40px hsl(17 89% 41% / 0.35)",
        "glow-accent": "0 0 20px hsl(174 77% 26% / 0.35)",
        glass:         "0 4px 24px hsl(0 0% 0% / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.10)",
        "glass-lg":    "0 8px 40px hsl(0 0% 0% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.12)",
        card:          "0 4px 12px hsl(0 0% 0% / 0.04), 0 1px 3px hsl(0 0% 0% / 0.06)",
        "card-lg":     "0 8px 24px hsl(0 0% 0% / 0.05), 0 2px 6px hsl(0 0% 0% / 0.06)",
        "card-sm":     "0 1px 3px hsl(0 0% 0% / 0.03), 0 1px 2px hsl(0 0% 0% / 0.04)",
      },

      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #C2410C, #E87445)",
        "gradient-brand":   "linear-gradient(135deg, #C2410C, #0F766E)",
        "gradient-brand-r": "linear-gradient(135deg, #0F766E, #C2410C)",
        "gradient-dark":    "linear-gradient(135deg, #1F1A14, #2C2620)",
        "gradient-subtle":  "linear-gradient(160deg, #FFF7F2, #F0FDFA)",
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
          "0%, 100%": { boxShadow: "0 0 14px hsl(17 89% 41% / 0.25)" },
          "50%":      { boxShadow: "0 0 28px hsl(17 89% 41% / 0.45)" },
        },
        progress: {
          "0%":   { width: "0%" },
          "100%": { width: "95%" },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
};

export default config;
