import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; 
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "../components/providers/theme-provider";
import { StatusProvider } from "../components/providers/status-provider";
// IMPORT YOUR SERVER HOOK
import { getPageData } from "@/app/components/hooks/hooks-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  // 1. Get Brand Name from Local Translation (Stable)
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });
  const brandName = t('brandName'); // "Moger Mulluk"

  // 2. Get Global SEO Description from Backend (Dynamic)
  // We'll use the 'nav' or 'home' key for the global description
  const globalData = await getPageData(lang, 'home');
  const siteDesc = globalData?.description || "The Realm of Conversations";

  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`, // Result: "Home | Moger Mulluk"
    },
    description: siteDesc,
    metadataBase: new URL("https://moger-mulluk.com"), 
    openGraph: {
      type: "website",
      siteName: brandName,
      images: [globalData?.seo?.ogImage || ""],
    },
    twitter: {
      card: "summary_large_image",
      title: brandName,
      description: siteDesc,
    }
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
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
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
            <StatusProvider>
               {children}
            </StatusProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}