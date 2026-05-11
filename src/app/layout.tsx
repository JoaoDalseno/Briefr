import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, DM_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Briefr — Briefs de criativos com IA",
    template: "%s · Briefr",
  },
  description:
    "Da ideia ao criativo em minutos. A IA que monta o brief completo do seu anúncio em português, com contexto BR.",
  keywords: [
    "brief de criativo",
    "anúncios",
    "tráfego pago",
    "Meta Ads",
    "Google Ads",
    "IA para marketing",
    "gestor de tráfego",
  ],
  authors: [{ name: "Briefr" }],
  creator: "Briefr",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Briefr — Briefs de criativos com IA",
    description:
      "Da ideia ao criativo em minutos. Em português, com contexto BR.",
    siteName: "Briefr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Briefr — Briefs de criativos com IA",
    description:
      "Da ideia ao criativo em minutos. Em português, com contexto BR.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSerifDisplay.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="antialiased bg-background text-foreground">
        <Suspense>
          <PostHogProvider>
            {children}
            <Toaster richColors position="top-right" />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
