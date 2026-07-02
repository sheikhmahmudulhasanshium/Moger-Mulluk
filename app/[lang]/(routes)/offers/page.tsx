import { setRequestLocale } from 'next-intl/server';
import { Metadata } from "next";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import PageProvider from "@/app/components/providers/page-provider";
import Body from "./body";
import { getPageData } from '@/app/components/hooks/hooks-server';

interface Props {
  params: Promise<{ lang: string }>;
}

// Dynamic Metadata for SEO and Internationalization
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'offers'); // Use 'menu' for menu page
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: data?.title,
    description: data?.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/offers`,
      languages: {
        'en': `${baseUrl}/en/offers`,
        'bn': `${baseUrl}/bn/offers`,
        'es': `${baseUrl}/es/offers`,
        'hi': `${baseUrl}/hi/offers`,
      },
    },
    openGraph: {
      title: data?.title,
      description: data?.description,
      images: [data?.seo?.ogImage || "/favicon/apple-touch-icon.png"],
    }
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