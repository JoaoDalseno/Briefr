import type { Metadata } from "next";
import Script from "next/script";
import Hero from "@/components/marketing/Hero";
import Waitlist from "@/components/marketing/Waitlist";
import StatsBar from "@/components/marketing/StatsBar";
import Features from "@/components/marketing/Features";
import FormatTabs from "@/components/marketing/FormatTabs";
import HowItWorks from "@/components/marketing/HowItWorks";
import SocialProof from "@/components/marketing/SocialProof";
import Pricing from "@/components/marketing/Pricing";
import Faq from "@/components/marketing/Faq";
import CtaFinal from "@/components/marketing/CtaFinal";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Briefr — Briefs de criativos com IA para gestores de tráfego",
  description:
    "Gere briefs completos para anúncios em segundos. Formatos para Meta Ads, TikTok e YouTube — estático, story, carrossel e vídeo UGC. Feito para o mercado brasileiro.",
  keywords: [
    "brief criativo",
    "gestão de tráfego",
    "IA para anúncios",
    "brief de anúncio",
    "marketing digital Brasil",
  ],
  authors: [{ name: "Briefr" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Briefr",
    title: "Briefr — Briefs de criativos com IA",
    description:
      "Gere briefs completos para anúncios em segundos. Para gestores de tráfego brasileiros.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Briefr — Briefs de criativos com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Briefr — Briefs de criativos com IA",
    description:
      "Gere briefs completos para anúncios em segundos. Para gestores de tráfego brasileiros.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`],
    creator: "@briefrapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Briefr",
  url: process.env.NEXT_PUBLIC_APP_URL,
  logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
  description:
    "Plataforma de geração de briefs de criativos com IA para o mercado brasileiro.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "Portuguese",
  },
  areaServed: "BR",
  foundingDate: "2024",
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Briefr",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: process.env.NEXT_PUBLIC_APP_URL,
  description:
    "Gere briefs completos para anúncios digitais em segundos usando inteligência artificial.",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "BRL" },
    { "@type": "Offer", name: "Pro", price: "97", priceCurrency: "BRL" },
    { "@type": "Offer", name: "Agência", price: "197", priceCurrency: "BRL" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Hero />
      <Waitlist />
      <StatsBar />
      <Features />
      <FormatTabs />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <Faq />
      <CtaFinal />
    </>
  );
}
