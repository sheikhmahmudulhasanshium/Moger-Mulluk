import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "../components/providers/theme-provider";
import { StatusProvider } from "../components/providers/status-provider";
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
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });
  const brandName = t('brandName'); 

  const globalData = await getPageData(lang, 'home');
  const siteDesc = globalData?.description || "The Realm of Conversations";
  const baseUrl = "https://moger-mulluk.vercel.app";

  // 1. IMAGE FIX: Use the 512x512 image instead of the small apple-touch-icon
  const fallbackImage = `${baseUrl}/favicon/web-app-manifest-512x512.png`;
  
  // 2. ABSOLUTE URL FIX: Ensure ogImage is always a full URL
  const ogImage = globalData?.seo?.ogImage 
    ? (globalData.seo.ogImage.startsWith('http') ? globalData.seo.ogImage : `${baseUrl}${globalData.seo.ogImage}`)
    : fallbackImage;

  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`, 
    },
    description: siteDesc,
    metadataBase: new URL(baseUrl),
    
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'bn': `${baseUrl}/bn`,
        'es': `${baseUrl}/es`,
        'hi': `${baseUrl}/hi`,
        'x-default': `${baseUrl}/en`,
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

    // 3. FACEBOOK FIX: This ensures 'property' is used instead of 'name'
    facebook: {
      appId: '2151814335752206'
    },

    openGraph: {
      type: "website",
      siteName: brandName,
      url: `${baseUrl}/${lang}`, 
      title: brandName,
      description: siteDesc,
      images: [{ 
        url: ogImage, 
        width: ogImage === fallbackImage ? 512 : 1200, 
        height: ogImage === fallbackImage ? 512 : 630, 
        alt: brandName 
      }],
    },
    twitter: {
      // 4. TWITTER FIX: "summary" is better for square images (512x512)
      card: ogImage === fallbackImage ? "summary" : "summary_large_image",
      title: brandName,
      description: siteDesc,
      images: [ogImage],
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