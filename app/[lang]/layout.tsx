import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { ThemeProvider } from "../components/providers/theme-provider";
import { StatusProvider } from "../components/providers/status-provider";
import { getPageData } from "@/app/components/hooks/hooks-server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });
  const brandName = t('brandName'); 
  const globalData = await getPageData(lang, 'home');
  const siteDesc = globalData?.description || "The Realm of Conversations";
  
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: brandName,
      template: `%s | ${brandName}`, 
    },
    description: siteDesc,
    
    // SEO: Tell Google about all 4 language versions
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'bn': '/bn',
        'es': '/es',
        'hi': '/hi',
      },
    },

    verification: {
      google: "XaIlvvAGDWME_Z9oUJnApUDnAKbjEBmmUxhJ_onO0SE",
    },

    icons: {
      icon: [{ url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
      apple: "/favicon/apple-touch-icon.png",
    },

    openGraph: {
      type: "website",
      siteName: brandName,
      url: `/${lang}`,
      images: [{ url: globalData?.seo?.ogImage || "/favicon/apple-touch-icon.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [globalData?.seo?.ogImage || "/favicon/apple-touch-icon.png"],
    }
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const messages = await getMessages();
  const baseUrl = "https://moger-mulluk.vercel.app";

  // MULTI-LANGUAGE STRUCTURED DATA
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CafeOrCoffeeShop", // More specific than Organization
        "name": "Moger Mulluk",
        "url": `${baseUrl}/${lang}`,
        "logo": `${baseUrl}/favicon/apple-touch-icon.png`,
        "image": `${baseUrl}/favicon/apple-touch-icon.png`,
        "description": "A cozy café for tea, coffee, and relaxed hangouts.",
        "hasMap": `${baseUrl}/${lang}/locations`,
        "areaServed": "BD",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BD"
        }
      },
      {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Offers",
            "url": `${baseUrl}/${lang}/offers`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Locations",
            "url": `${baseUrl}/${lang}/locations`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "About Us",
            "url": `${baseUrl}/${lang}/about`
          }
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={lang}>
          <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
            <StatusProvider>
               {children}
            </StatusProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}