'use client'

import { motion } from 'framer-motion'
import { Zap, Target, Building2, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// ─── Dados ───────────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    id: 'gestores',
    icon: Zap,
    label: 'Gestores',
    title: 'Para gestores de tráfego',
    tagline: '"Pare de improvisar briefs no WhatsApp"',
    pain: 'Você passa horas explicando pro designer o que quer, recebe peças erradas e fica refazendo. Com o Briefr, o brief já existe antes de você abrir o WhatsApp.',
    bullets: [
      'Brief por formato em 3 minutos',
      'Histórico de briefs por cliente',
      'Copy e hook já prontos pra briefar',
    ],
    gradient: 'from-primary/5 to-primary/10',
    border: 'border-primary/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'anunciantes',
    icon: Target,
    label: 'Anunciantes',
    title: 'Para anunciantes',
    tagline: '"Brief profissional sem precisar de agência"',
    pain: 'Você sabe o que quer comunicar, mas não sabe como estruturar pro designer ou copywriter. O Briefr traduz sua ideia em um briefing técnico e completo.',
    bullets: [
      'Sem precisar entender de marketing',
      'Linguagem clara pra qualquer prestador',
      'Resultado visualmente alinhado com sua marca',
    ],
    gradient: 'from-accent/5 to-accent/10',
    border: 'border-accent/20',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  {
    id: 'agencias',
    icon: Building2,
    label: 'Agências',
    title: 'Para agências',
    tagline: '"Acelere a entrega de criativos pra cada cliente"',
    pain: 'Cada cliente tem produto, tom e público diferentes. Criar briefs do zero pra cada campanha consome tempo do seu time. O Briefr escala isso.',
    bullets: [
      'Briefs padronizados para toda a equipe',
      'Plano Agência para múltiplos clientes',
      'Exportação em PDF com branding',
    ],
    gradient: 'from-primary/5 via-accent/5 to-accent/10',
    border: 'border-border',
    iconBg: 'bg-gradient-brand',
    iconColor: 'text-white',
  },
]

// ─── Persona Card ─────────────────────────────────────────────────────────────

function PersonaCard({
  persona,
  className,
}: {
  persona: typeof PERSONAS[0]
  className?: string
}) {
  return (
    <div
      className={cn(
        'group flex flex-col gap-5 rounded-xl border bg-white p-7',
        'shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300',
        persona.border,
        className,
      )}
    >
      {/* Icon */}
      <div className={cn('w-fit rounded-xl p-3', persona.iconBg)}>
        <persona.icon className={cn('size-6', persona.iconColor)} />
      </div>

      {/* Title + tagline */}
      <div className="space-y-1.5">
        <h3 className="font-heading font-semibold text-lg tracking-heading text-foreground">
          {persona.title}
        </h3>
        <p className="text-sm font-medium text-foreground/80 italic">{persona.tagline}</p>
      </div>

      {/* Pain */}
      <p className="text-sm text-muted-foreground leading-relaxed">{persona.pain}</p>

      {/* Bullets */}
      <ul className="space-y-2.5 pt-1 border-t border-border">
        {persona.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground/80">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ForWhom() {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Para quem é"
            title="Feito para quem anuncia de verdade"
            subtitle="Seja você autônomo, direto ou agência — o Briefr se adapta ao seu fluxo."
          />
        </motion.div>

        {/* Desktop: 3 cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:grid md:grid-cols-3 gap-6 mt-14"
        >
          {PERSONAS.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </motion.div>

        {/* Mobile: Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden mt-10"
        >
          <Tabs defaultValue="gestores">
            <TabsList className="w-full mb-6">
              {PERSONAS.map(({ id, label }) => (
                <TabsTrigger key={id} value={id} className="flex-1 text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {PERSONAS.map((persona) => (
              <TabsContent key={persona.id} value={persona.id}>
                <PersonaCard persona={persona} />
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </Container>
    </section>
  )
}
