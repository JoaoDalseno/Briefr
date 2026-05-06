import type { Metadata } from 'next'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Briefr — Briefs de criativos com IA',
  description:
    'Gere briefs completos para anúncios estáticos, stories e vídeos UGC em segundos. IA treinada para o mercado brasileiro.',
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
