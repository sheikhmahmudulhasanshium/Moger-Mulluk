// app/[lang]/page.tsx
import { Metadata } from "next";
import { getPageData } from "@/app/components/hooks/hooks-server";
import { notFound } from "next/navigation";
import PageProvider from "../../components/providers/page-provider";
import Body from "../home/body";
import Header from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'home');

  if (!data) return { title: "Moger Mulluk" };

  // SEO & SOCIAL PREVIEW (WhatsApp/Facebook/X)
  return {
    title: data.title,
    description: data.description,
    keywords: data.seo.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://moger-mulluk.com/${lang}`, 
      siteName: 'Moger Mulluk',
      images: [
        {
          url: data.seo.ogImage || '', 
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.seo.ogImage],
    },
    robots: {
      index: !data.seo.isNoIndex,
      follow: !data.seo.isNoIndex,
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Axios Hook (Deduplicated via react cache)
  const data = await getPageData(lang, 'home');

  if (!data) {
    notFound();
  }

  return (
    <PageProvider 
      header={<Header/>} 
      footer={<Footer/>} 
      sidebar={<Sidebar/>} 
      navbar={<Navbar/>}
    >
      {/* Dynamic Data passed to the Body component */}
      <Body data={data} />  
    </PageProvider>
  );
}