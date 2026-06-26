import { setRequestLocale } from 'next-intl/server';
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import PageProvider from "@/app/components/providers/page-provider";
import Body from "./body";

interface Props {
  params: Promise<{ lang: string }>;
}

// Dynamic Metadata for SEO and Internationalization
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://moger-mulluk.vercel.app";
  
  // Fetching translations for the title
  const t = await getTranslations({ locale: lang, namespace: 'Navigation' });

  return {
    title: t('offers'), // Pulls "Special Offers" / "বিশেষ অফার" / etc.
    description: "Experience the magic of 7-layer tea and authentic Mezban deals at Moger Mulluk.",
    alternates: {
      canonical: `${baseUrl}/${lang}/offers`,
      languages: {
        'en': `${baseUrl}/en/offers`,
        'bn': `${baseUrl}/bn/offers`,
        'es': `${baseUrl}/es/offers`,
        'hi': `${baseUrl}/hi/offers`,
        'x-default': `${baseUrl}/en/offers`,
      },
    },
  };
}

const OffersPage = async ({ params }: Props) => {
    // 1. Await the params for Next.js 15 compatibility
    const { lang } = await params;

    // 2. Set the locale for the request to enable static rendering/translations
    setRequestLocale(lang);

    return ( 
        <PageProvider 
            header={<Header/>} 
            footer={<Footer/>} 
            sidebar={<Sidebar/>} 
            navbar={<Navbar/>}
        >
            <Body />
        </PageProvider>
     );
}
 
export default OffersPage;