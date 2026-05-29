import { setRequestLocale } from 'next-intl/server'; // Import this
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://moger-mulluk.vercel.app";
  const t = await getTranslations({ locale: lang, namespace: 'Navigation' });

  return {
    title: t('menu'),
    alternates: {
      canonical: `${baseUrl}/${lang}/menu`,
      languages: {
        'en': `${baseUrl}/en/menu`,
        'bn': `${baseUrl}/bn/menu`,
        'es': `${baseUrl}/es/menu`,
        'hi': `${baseUrl}/hi/menu`,
        'x-default': `${baseUrl}/en/menu`,
      },
    },
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