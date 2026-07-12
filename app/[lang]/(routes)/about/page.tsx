import { Metadata } from "next";
import { getPageData } from "@/app/components/hooks/hooks-server";
import { notFound } from "next/navigation";
import PageProvider from "@/app/components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";
import Body from "./body"; 

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'about');
  const baseUrl = "https://moger-mulluk.vercel.app";
  const fallbackImage = `${baseUrl}/favicon/web-app-manifest-512x512.png`;

  if (!data) return { title: "About Us | Moger Mulluk" };

  return {
    title: data.title,
    description: data.description,
    facebook: { appId: '2151814335752206' },
    alternates: {
      canonical: `${baseUrl}/${lang}/about`,
      languages: {
        'en': `${baseUrl}/en/about`,
        'bn': `${baseUrl}/bn/about`,
        'es': `${baseUrl}/es/about`,
        'hi': `${baseUrl}/hi/about`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${baseUrl}/${lang}/about`,
      type: 'article',
      images: [{ url: data.seo?.ogImage || fallbackImage, width: 1200, height: 630, alt: data.title }],
    },
    // FIX: Added explicit Twitter metadata to match OpenGraph
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.seo?.ogImage || fallbackImage],
    }
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const data = await getPageData(lang, 'about');

  if (!data) notFound();

  return (
    <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
      <Body data={data} />  
    </PageProvider>
  );
}