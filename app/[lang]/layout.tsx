import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; 
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'; // Added getTranslations
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "../components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. DYNAMIC METADATA GENERATION
// app/[lang]/layout.tsx
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });

  return {
    title: {
      default: t('brandName'),
      template: `%s | ${t('brandName')}`, // This adds " | Brand Name" to every sub-page
    },
    description: "Your site description",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({lang: locale}));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  
  setRequestLocale(lang);
  
  const messages = await getMessages();
  // Fetch translations to use inside the <html> head tags for non-metadata API tags
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        {/* Updated dynamically from i18n */}
        <meta name="apple-mobile-web-app-title" content={t('brandName')} />
        <link rel="manifest" href="/favicon/site.webmanifest" />      
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={lang}>
          <ThemeProvider 
            attribute={'class'} 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
             {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}