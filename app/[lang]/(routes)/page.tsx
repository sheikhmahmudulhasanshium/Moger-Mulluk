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
  const baseUrl = "https://moger-mulluk.vercel.app";
  const title = `${data?.title} | Moger Mulluk`;

  return {
    title: title,
    description: data?.description,
    openGraph: {
      title: title,
      description: data?.description,
      url: `${baseUrl}/${lang}`,
      images: [{ url: `${baseUrl}/favicon/web-app-manifest-512x512.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title, // Matches OG
      images: [`${baseUrl}/favicon/web-app-manifest-512x512.png`],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const data = await getPageData(lang, 'home');
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "Moger Mulluk",
    "url": `https://moger-mulluk.vercel.app/${lang}`,
    "image": "https://moger-mulluk.vercel.app/favicon/web-app-manifest-512x512.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sector 3, Uttara",
      "addressLocality": "Dhaka",
      "addressCountry": "BD"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
        <Body data={data} />  
      </PageProvider>
    </>
  );
}