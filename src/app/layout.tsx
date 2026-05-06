import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Briefr — Briefs de criativos com IA",
    template: "%s | Briefr",
  },
  description:
    "Gere briefs completos para anúncios estáticos, stories e vídeos UGC em segundos. IA treinada para o mercado brasileiro.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://briefr.com.br"),
  openGraph: {
    siteName: "Briefr",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">
        {/* Skip to content — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Ir para o conteúdo
        </a>

        <Suspense>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </Suspense>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: 'font-sans text-sm',
            },
          }}
        />
      </body>
    </html>
  );
}
