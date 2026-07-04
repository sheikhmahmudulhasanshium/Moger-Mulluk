import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageProvider from "@/app/components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";
import Body from "./body"; 
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'FAQPage' });
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${lang}/notice`,
      languages: {
        'en': `${baseUrl}/en/notice`,
        'bn': `${baseUrl}/bn/notice`,
        'es': `${baseUrl}/es/notice`,
        'hi': `${baseUrl}/hi/notice`,
      },
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${lang}/notice`,
      title: t('title'),
      description: t('description'),
      images: [{ url: "/favicon/web-app-manifest-512x512.png", width: 1200, height: 630 }],
    }
  };
}

export default async function NoticeBoard({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    setRequestLocale(lang);
  
    return (
      <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
         <Body />
      </PageProvider>
    );
}