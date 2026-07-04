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

  if (!data) return { title: "Our Story | Moger Mulluk" };

  return {
    title: data.title,
    description: data.description,
    // FIX FOR SEARCH CONSOLE: Tells Google exactly which page is the "master" version
    alternates: {
      canonical: `${baseUrl}/${lang}/about`,
      languages: {
        'en': `${baseUrl}/en/about`,
        'es': `${baseUrl}/es/about`,
        'bn': `${baseUrl}/bn/about`,
        'hi': `${baseUrl}/hi/about`,
        'x-default': `${baseUrl}/en/about`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${baseUrl}/${lang}/about`, // Added

      images: [{url: data.seo.ogImage, width: 1200, height: 630, alt: data.title}],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: [{url: data.seo.ogImage, width: 1200, height: 630, alt: data.title}],
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