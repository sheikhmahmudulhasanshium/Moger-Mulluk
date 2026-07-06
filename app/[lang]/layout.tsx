import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { ThemeProvider } from "../components/providers/theme-provider";
import { StatusProvider } from "../components/providers/status-provider";
import { getPageData } from "@/app/components/hooks/hooks-server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: 'swap' });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: 'swap' });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });
  const brandName = t('brandName'); 
  const globalData = await getPageData(lang, 'home');
  const baseUrl = "https://moger-mulluk.vercel.app";
  const fallbackImage = `${baseUrl}/favicon/web-app-manifest-512x512.png`;
  
  const ogImage = globalData?.seo?.ogImage 
    ? (globalData.seo.ogImage.startsWith('http') ? globalData.seo.ogImage : `${baseUrl}${globalData.seo.ogImage}`)
    : fallbackImage;

  return {
    metadataBase: new URL(baseUrl),
    title: { default: brandName, template: `%s | ${brandName}` },
    description: globalData?.description || "The Realm of Conversations",
    
    // 1. ADDED BACK: HTML ID (Google Site Verification Meta Tag)
    // This ensures the "HTML Tag" method stays verified.
    verification: {
      google: "google2529eeb245344b02", 
    },

    openGraph: {
      type: "website",
      siteName: brandName,
      title: brandName,
      description: globalData?.description,
      url: baseUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: brandName }],
    },
    twitter: {
      card: "summary_large_image",
      title: brandName,
      description: globalData?.description,
      images: [ogImage],
    },
    facebook: { 
        appId: '2151814335752206' 
    },
    alternates: {
      canonical: lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`, 'bn': `${baseUrl}/bn`, 'es': `${baseUrl}/es`, 'hi': `${baseUrl}/hi`, 'x-default': `${baseUrl}/`,
      },
    },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* 
            GOOGLE ANALYTICS SCRIPT
            Kept as raw HTML tags to ensure the "Google Analytics" 
            ownership method stays verified in Search Console.
        */}
        {/* eslint-disable @next/next/next-script-for-ga */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CW0ES20MGM"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CW0ES20MGM');
            `,
          }}
        />
        {/* eslint-enable @next/next/next-script-for-ga */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={lang}>
          <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
            <StatusProvider>{children}</StatusProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}