'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/branding/Logo'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Recursos',        href: '#features' },
  { label: 'Como funciona',   href: '#how' },
  { label: 'Preços',          href: '#pricing' },
  { label: 'FAQ',             href: '#faq' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-md border-b border-border/60 shadow-card-sm'
          : 'bg-transparent',
      )}
      style={scrolled ? { backgroundColor: 'rgba(255,252,245,0.85)' } : undefined}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" aria-label="Briefr - Página inicial">
            <Logo size={32} />
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Navegação principal">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="font-medium hover:text-foreground transition-colors duration-150"
                style={{ fontSize: '15px', color: '#4A4238' }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Actions — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#C2410C] text-white font-medium rounded-lg transition-colors hover:bg-[#9A3309]"
              style={{ fontSize: '14px', padding: '9px 20px' }}
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Abrir menu" />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>

              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="border-b border-border px-6 py-4">
                  <SheetTitle>
                    <Logo size={32} />
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col px-4 py-6 gap-1" aria-label="Menu mobile">
                  {NAV_LINKS.map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-primary/6 hover:text-primary transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </nav>

                <div className="px-4 pb-6 flex flex-col gap-2 border-t border-border pt-4">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: 'outline', size: 'default' })}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ size: 'default' })}
                  >
                    Começar grátis
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  )
}
