import { setRequestLocale } from 'next-intl/server';
import { Metadata } from "next"; 
import { getPageData } from '@/app/components/hooks/hooks-server';
import PageProvider from "@/app/components/providers/page-provider";
import Body from "./body";
import Header from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import SocialShare from "@/app/components/common/social-share";

interface Props {
  params: Promise<{ lang: string }>;
}

// 1. GENERATE METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'menu');
  const baseUrl = "https://moger-mulluk.vercel.app";
  
  // Standardize titles to prevent Facebook Debugger "Mismatched" error
  const titleText = `${data?.title || 'Kingdom Menu'} | Moger Mulluk`;
  const descText = data?.description || "Explore the legendary flavors of Moger Mulluk.";
  const ogImage = data?.seo?.ogImage || `${baseUrl}/favicon/web-app-manifest-512x512.png`;

  return {
    metadataBase: new URL(baseUrl),
    title: titleText,
    description: descText,
    // Inside your menu/page.tsx generateMetadata function:
alternates: {
   canonical: lang === 'en' ? `${baseUrl}/menu` : `${baseUrl}/${lang}/menu`,
  languages: {
    'en': `${baseUrl}/menu`,      // UPDATE THIS: Remove "/en"
    'bn': `${baseUrl}/bn/menu`,
    'es': `${baseUrl}/es/menu`,
    'hi': `${baseUrl}/hi/menu`,
  },
},
    openGraph: {
      type: "website",
      url: `${baseUrl}/${lang}/menu`,
      title: titleText, 
      description: descText,
      siteName: "Moger Mulluk",
      images: [{ url: ogImage, width: 1200, height: 630, alt: titleText }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText, 
      description: descText,
      images: [ogImage],
    }
  };
}

// 2. PAGE COMPONENT
const MenuPage = async ({ params }: Props) => {
    const { lang } = await params;
    
    // We fetch the data here too so we can use titleText in the share button
    const data = await getPageData(lang, 'menu');
    const titleText = `${data?.title || 'Kingdom Menu'} | Moger Mulluk`;
    
    setRequestLocale(lang);

    return ( 
        <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
            <div className="container mx-auto px-4 py-6">
                

                <Body/>
                {/* SHARE BUTTON: Inline flow, not fixed */}
                <div className="flex flex-col items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                           {data?.title || "Kingdom Menu"}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-sm font-medium text-zinc-400">Share:</span>
                        <SocialShare title={titleText} />
                    </div>
                </div>
            </div>
        </PageProvider>
     );
}
 
export default MenuPage;