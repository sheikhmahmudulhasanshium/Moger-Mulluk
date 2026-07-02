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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'menu'); // Use 'menu' for menu page
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: data?.title,
    description: data?.description,
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
      title: data?.title,
      description: data?.description,
      images: [data?.seo?.ogImage || "/favicon/apple-touch-icon.png"],
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