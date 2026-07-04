import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "../components/providers/theme-provider";
import { StatusProvider } from "../components/providers/status-provider";
import { getPageData } from "@/app/components/hooks/hooks-server";

// 1. YOUR ORIGINAL FONTS - KEPT
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. METADATA WITH SEO FIXES
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });
  const brandName = t('brandName'); 

  const globalData = await getPageData(lang, 'home');
  const siteDesc = globalData?.description || "The Realm of Conversations";
  
  // DOMAIN FIX
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`, 
    },
    description: siteDesc,
    metadataBase: new URL(baseUrl), // FIXED DOMAIN
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'bn': `${baseUrl}/bn`,
        'es': `${baseUrl}/es`,
        'hi': `${baseUrl}/hi`,
      },
    },

    verification: {
      google: "XaIlvvAGDWME_Z9oUJnApUDnAKbjEBmmUxhJ_onO0SE",
    },

    icons: {
      icon: [
        { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon/favicon.ico",
      apple: "/favicon/apple-touch-icon.png",
    },
    manifest: "/favicon/site.webmanifest",
    other: {
      'fb:app_id': '2151814335752206'
    },
    openGraph: {
      type: "website",
      siteName: brandName,
      url: `${baseUrl}/${lang}`, 
      title: brandName,
      description: siteDesc,
      images: [{ url: globalData?.seo?.ogImage || "/favicon/apple-touch-icon.png", width: 1200, height: 630, alt: brandName }],
    },
    twitter: {
      card: "summary_large_image",
      title: brandName,
      description: siteDesc,
      images: [globalData?.seo?.ogImage || "/favicon/apple-touch-icon.png"],
    }
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ lang: locale }));
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
  const baseUrl = "https://moger-mulluk.vercel.app";

  // STARBUCKS-STYLE SCHEMA (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Moger Mulluk",
        "url": `${baseUrl}/${lang}`,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/${lang}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ItemList",
        "name": "Navigation",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Menu", "item": `${baseUrl}/${lang}/menu` },
          { "@type": "ListItem", "position": 2, "name": "Offers", "item": `${baseUrl}/${lang}/offers` },
          { "@type": "ListItem", "position": 3, "name": "Locations", "item": `${baseUrl}/${lang}/locations` }
        ]
      }
    ]
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* 3. YOUR ORIGINAL CLASSNAMES & HYDRATION SETTINGS - KEPT */}
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} 
        suppressHydrationWarning
      >
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