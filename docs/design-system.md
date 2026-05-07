# Briefr — Design System

> Identidade visual: SaaS premium tech, clean, espaçado, com glassmorphism sutil.
> Inspiração: Linear, Vercel, Raposa.

---

## Paleta de cores

| Token           | Hex       | oklch                        | Uso                              |
|-----------------|-----------|------------------------------|----------------------------------|
| `primary-500`   | `#6C63E0` | `oklch(0.563 0.196 271.2)`   | Botões, links, foco, ícones      |
| `secondary-900` | `#1A1A2E` | `oklch(0.154 0.032 264.4)`   | Background dark, texto principal |
| `accent-500`    | `#FF6B6B` | `oklch(0.724 0.188 19.8)`    | CTAs de destaque, badges hot     |

### Escala de cores completa

```
primary-50  → oklch(0.967 0.017 271.2)   -- backgrounds sutis
primary-100 → oklch(0.928 0.042 271.2)   -- hover states leve
primary-200 → oklch(0.871 0.079 271.2)
primary-300 → oklch(0.782 0.123 271.2)
primary-400 → oklch(0.680 0.163 271.2)
primary-500 → oklch(0.563 0.196 271.2)   -- #6C63E0 (base)
primary-600 → oklch(0.494 0.196 271.2)   -- hover buttons
primary-700 → oklch(0.420 0.182 271.2)
primary-800 → oklch(0.341 0.154 271.2)
primary-900 → oklch(0.253 0.112 271.2)   -- texto sobre fundo claro
```

```
accent-50  → oklch(0.970 0.015 19.8)
accent-500 → oklch(0.724 0.188 19.8)    -- #FF6B6B (base)
accent-600 → oklch(0.655 0.188 19.8)    -- hover CTA
```

### Neutros usados
- Branco puro: `oklch(1 0 0)`
- `slate-50`:  `oklch(0.984 0.003 247.8)`
- `slate-100`: `oklch(0.966 0.006 264.4)`
- `slate-200`: `oklch(0.929 0.013 264.4)`
- `slate-500`: `oklch(0.557 0.018 264.4)`
- `slate-700`: `oklch(0.373 0.027 264.4)`
- `slate-900`: `oklch(0.154 0.032 264.4)`

---

## Tipografia

| Elemento     | Fonte | Peso   | Tamanho    | Letter-spacing |
|--------------|-------|--------|------------|----------------|
| Heading h1   | Inter | 700    | 48–64px    | `-0.02em`      |
| Heading h2   | Inter | 700    | 36–48px    | `-0.02em`      |
| Heading h3   | Inter | 600    | 24–30px    | `-0.02em`      |
| Body large   | Inter | 400    | 18px       | `0`            |
| Body         | Inter | 400    | 16px       | `0`            |
| Body small   | Inter | 400    | 14px       | `0`            |
| Caption      | Inter | 500    | 12px       | `0.04em`       |
| Eyebrow      | Inter | 600    | 12px       | `0.1em`        |

```tsx
// Tailwind classes para tipografia
"font-heading font-bold tracking-heading text-5xl"     // h1
"font-heading font-bold tracking-heading text-4xl"     // h2
"font-heading font-semibold tracking-heading text-2xl" // h3
"text-base text-muted-foreground leading-relaxed"      // body
"text-xs font-semibold uppercase tracking-widest"      // eyebrow
```

---

## Border radius

| Token        | Valor   | Uso                            |
|--------------|---------|--------------------------------|
| `rounded-sm` | `8px`   | Inputs internos, small tags    |
| `rounded-md` | `12px`  | **Padrão** — botões, inputs    |
| `rounded-lg` | `16px`  | Cards, modais                  |
| `rounded-xl` | `20px`  | Cards de destaque, hero        |
| `rounded-2xl`| `24px`  | Containers grandes             |
| `rounded-full`| `9999px`| Badges, avatares, pills       |

---

## Sombras e glow

```css
/* Glow principal (hover em botões primários) */
shadow-glow-sm: 0 0 14px oklch(0.563 0.196 271.2 / 0.25)
shadow-glow:    0 0 24px oklch(0.563 0.196 271.2 / 0.30)
shadow-glow-lg: 0 0 40px oklch(0.563 0.196 271.2 / 0.35)

/* Glow coral (CTAs de destaque) */
shadow-glow-accent: 0 0 20px oklch(0.724 0.188 19.8 / 0.35)

/* Glass cards */
shadow-glass:    0 4px 24px oklch(0 0 0 / 0.06), inset 0 1px 0 oklch(1 0 0 / 0.10)
shadow-glass-lg: 0 8px 40px oklch(0 0 0 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.12)

/* Cards comuns */
shadow-card:    0 4px 12px oklch(0 0 0 / 0.05), 0 1px 3px oklch(0 0 0 / 0.08)
shadow-card-lg: 0 8px 24px oklch(0 0 0 / 0.06), 0 2px 6px oklch(0 0 0 / 0.08)
```

---

## Gradientes

```css
/* Roxo → Roxo claro (elementos primários) */
bg-gradient-primary: linear-gradient(135deg, oklch(0.563 0.196 271.2), oklch(0.680 0.163 271.2))

/* Roxo → Coral (brand, headings, hero) */
bg-gradient-brand:   linear-gradient(135deg, oklch(0.563 0.196 271.2), oklch(0.724 0.188 19.8))

/* Dark background */
bg-gradient-dark:    linear-gradient(135deg, oklch(0.154 0.032 264.4), oklch(0.231 0.032 264.4))
```

### Texto com gradiente

```tsx
// Utility class direta
<h1 className="text-gradient-brand">Headline</h1>

// Componente
import { GradientText } from "@/components/ui/GradientText"
<GradientText gradient="brand" as="h1">Headline</GradientText>
```

---

## Glassmorphism

Para cards com efeito glass, use a utility `.glass`:

```tsx
<div className="glass rounded-xl p-6">
  conteúdo
</div>
```

CSS variables controlam o glass:
- `--glass-bg`: `oklch(1 0 0 / 0.72)` (light) | `oklch(0.190 0.032 264.4 / 0.75)` (dark)
- `--glass-border`: `oklch(0.563 0.196 271.2 / 0.12)`
- `--glass-blur`: `16px`

---

## Componentes UI

### Button

```tsx
import { Button } from "@/components/ui/button"

// Primário (roxo) — ação principal
<Button>Gerar brief</Button>

// CTA (coral) — conversão máxima, ex: upgrade, assinar
<Button variant="cta">Assinar agora</Button>

// Secondary — ações secundárias
<Button variant="secondary">Ver histórico</Button>

// Outline — alternativo
<Button variant="outline">Cancelar</Button>

// Ghost — nav, toolbar
<Button variant="ghost">Voltar</Button>

// Sizes
<Button size="xl">Grande CTA</Button>
<Button size="sm">Pequeno</Button>
<Button size="icon"><PlusIcon /></Button>
```

### Logo

```tsx
import { Logo } from "@/components/branding/Logo"

<Logo />                           // md, default
<Logo size="lg" />                 // grande
<Logo variant="white" />           // em fundos escuros
<Logo iconOnly size="sm" />        // apenas ícone
```

### GradientText

```tsx
import { GradientText } from "@/components/ui/GradientText"

<GradientText gradient="brand" as="h1" className="text-5xl font-bold">
  Crie briefs incríveis
</GradientText>
```

### Container

```tsx
import { Container } from "@/components/ui/Container"

<Container>...</Container>
<Container size="narrow" className="py-20">...</Container>
<Container size="wide">...</Container>
```

### SectionHeader

```tsx
import { SectionHeader } from "@/components/ui/SectionHeader"

<SectionHeader
  eyebrow="Como funciona"
  title="Briefs prontos em segundos"
  subtitle="Descreva seu produto e deixe a IA fazer o trabalho pesado."
/>

// Com gradiente no título:
<SectionHeader
  eyebrow="Planos"
  title="Simples e transparente"
  subtitle="Sem pegadinhas. Cancele quando quiser."
  gradient
/>

// Alinhado à esquerda:
<SectionHeader
  title="Seus briefs recentes"
  align="left"
/>
```

---

## Padrões de layout

### Seção com Container

```tsx
<section className="py-16 sm:py-24">
  <Container>
    <SectionHeader eyebrow="..." title="..." subtitle="..." />
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* cards */}
    </div>
  </Container>
</section>
```

### Card glass de destaque

```tsx
<div className="glass rounded-xl p-8 shadow-glass-lg">
  <h3 className="font-heading font-semibold tracking-heading text-xl">Título</h3>
  <p className="mt-2 text-muted-foreground">Descrição</p>
</div>
```

### Card padrão (shadcn)

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card className="shadow-card hover:shadow-card-lg transition-shadow">
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>conteúdo</CardContent>
</Card>
```

---

## CSS Variables de referência

```css
/* Light mode */
--primary:   oklch(0.563 0.196 271.2)   /* #6C63E0 */
--accent:    oklch(0.724 0.188 19.8)    /* #FF6B6B */
--secondary: oklch(0.94 0.025 271.2)    /* lilás leve */
--background: oklch(1 0 0)              /* branco */
--foreground: oklch(0.154 0.032 264.4)  /* #1A1A2E */
--border:    oklch(0.920 0.012 271.2)
--radius:    0.75rem                    /* 12px */
```
