
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
  
  // 1. Get Brand Name from Local Translation
  const t = await getTranslations({ locale: lang, namespace: 'Logo' });
  const brandName = t('brandName'); 

  // 2. Get Global SEO Description from Backend
  const globalData = await getPageData(lang, 'home');
  const siteDesc = globalData?.description || "The Realm of Conversations";

  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`, 
    },
    description: siteDesc,
    metadataBase: new URL("https://moger-mulluk.com"),
    
    // GOOGLE VERIFICATION FIX
    verification: {
      google: "XaIlvvAGDWME_Z9oUJnApUDnAKbjEBmmUxhJ_onO0SE", // <-- PASTE YOUR CODE HERE
    },

    // FAVICONS & MANIFEST (Moved from manual <head> to Metadata API)
    icons: {
      icon: [
        { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon/favicon.ico",
      apple: "/favicon/apple-touch-icon.png",
    },
    manifest: "/favicon/site.webmanifest",

    // OTHER META TAGS
    appleWebApp: {
      title: brandName,
    },

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

  return (
    <html lang={lang} suppressHydrationWarning>
      {/* 
          IMPORTANT: No manual <head> tag here. 
          Next.js automatically injects metadata, icons, and verification 
          from the generateMetadata function above.
      */}
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