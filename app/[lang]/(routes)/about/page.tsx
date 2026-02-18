// app/[lang]/about/page.tsx
import { Metadata } from "next";
import { getPageData } from "@/app/components/hooks/hooks-server";
import { notFound } from "next/navigation";
import PageProvider from "@/app/components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Body from "./body";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'about');

  if (!data) return { title: "Our Story | Moger Mulluk" };

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.seo.ogImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: [data.seo.ogImage],
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