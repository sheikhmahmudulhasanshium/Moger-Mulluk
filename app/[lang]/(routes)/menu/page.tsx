import { setRequestLocale } from 'next-intl/server'; // Import this
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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'menu');
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: data?.title,
    description: data?.description,
    facebook: { appId: '2151814335752206' },
    alternates: {
      canonical: `${baseUrl}/${lang}/menu`,
      languages: {
        'en': `${baseUrl}/en/menu`,
        'bn': `${baseUrl}/bn/menu`,
        'es': `${baseUrl}/es/menu`,
        'hi': `${baseUrl}/hi/menu`,
      },
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${lang}/menu`,
      title: data?.title,
      description: data?.description,
      images: [{ url: data?.seo?.ogImage || `${baseUrl}/favicon/web-app-manifest-512x512.png`, width: 1200, height: 630 ,alt: data?.title}],
    }
  };
}

const MenuPage = async ({ params }: Props) => {
    // 1. We AWAIT the params
    const { lang } = await params;

    // 2. We USE the lang variable here. 
    // This tells next-intl which language to use for this specific request.
    // It also stops the "unused variable" error.
    setRequestLocale(lang);

    return ( 
        <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
            <Body/>
        </PageProvider>
     );
}
 
export default MenuPage;