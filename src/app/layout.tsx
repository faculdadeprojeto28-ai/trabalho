import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'ObraCircular | Sua sobra vale. Sua obra economiza.',
  description:
    'Marketplace nacional para compra e venda de materiais de construção excedentes, sobras de obras, pontas de estoque e materiais reutilizáveis com segurança e sustentabilidade.',
  keywords: [
    'materiais de construção',
    'sobra de obra',
    'ponta de estoque',
    'porcelanato barato',
    'cimento',
    'madeira demolição',
    'economia circular',
    'marketplace construção civil',
    'reformas sustentáveis',
  ],
  authors: [{ name: 'ObraCircular Brasil' }],
  openGraph: {
    title: 'ObraCircular | Marketplace de Sobras e Materiais da Construção Civil',
    description: 'Compre e venda materiais excedentes e economize até 60% na sua obra.',
    url: 'https://obracircular.com.br',
    siteName: 'ObraCircular',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
