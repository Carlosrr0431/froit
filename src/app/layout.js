import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';
import Providers from '@/components/Providers';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'], // Pesos más ligeros
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: {
    default: "FroIT - Automatización IA para WhatsApp Business",
    template: "%s | FroIT"
  },
  description: "Transforma tu WhatsApp Business con agentes de inteligencia artificial. Automatiza conversaciones, integra con CRM y convierte más clientes 24/7. Prueba gratis por 14 días.",
  keywords: [
    "WhatsApp Business",
    "Automatización",
    "Inteligencia Artificial", 
    "Chatbot",
    "IA conversacional",
    "CRM integración",
    "Ventas automáticas",
    "Atención al cliente"
  ],
  authors: [{ name: "FroIT Team" }],
  creator: "FroIT",
  publisher: "FroIT",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://froit.ai",
    title: "FroIT - Automatización IA para WhatsApp Business",
    description: "Transforma tu WhatsApp Business con agentes de inteligencia artificial. Automatiza conversaciones, integra con CRM y convierte más clientes 24/7.",
    siteName: "FroIT",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FroIT - Automatización IA para WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FroIT - Automatización IA para WhatsApp Business",
    description: "Transforma tu WhatsApp Business con agentes de inteligencia artificial. Automatiza conversaciones, integra con CRM y convierte más clientes 24/7.",
    creator: "@froit_ai",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://froit.ai",
    languages: {
      'es-ES': 'https://froit.ai',
      'en-US': 'https://froit.ai/en',
    },
  },
  category: 'Technology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5X78SFB3');`}
        </Script>
        {/* End Google Tag Manager */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FroIT CRM" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${montserrat.variable} antialiased font-sans`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5X78SFB3"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
