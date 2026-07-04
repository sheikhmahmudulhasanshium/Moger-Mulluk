import { Suspense } from "react"; // Added Suspense
import { MasterFAQ } from "@/lib/data";
import PageProvider from "../../../components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Body from "./body";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";
import { Metadata } from "next";
import { getPageData } from "@/app/components/hooks/hooks-server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'faq');
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: data?.title,
    description: data?.description,
    facebook: { appId: '2151814335752206' },
    alternates: {
      canonical: `${baseUrl}/${lang}/faq`,
      languages: {
        'en': `${baseUrl}/en/faq`,
        'bn': `${baseUrl}/bn/faq`,
        'es': `${baseUrl}/es/faq`,
        'hi': `${baseUrl}/hi/faq`,
      },
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${lang}/faq`,
      title: data?.title,
      description: data?.description,
      images: [{ url: data?.seo?.ogImage || `${baseUrl}/favicon/web-app-manifest-512x512.png`, width: 1200, height: 630 ,alt: data?.title}],
    }
  };
}

export default async function FAQs({ params }: { 
    params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const activeFAQ = MasterFAQ[lang.toUpperCase()] || MasterFAQ.EN;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFAQ.items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
        {/* Wrapped Body in Suspense to fix the build error */}
        <Suspense fallback={<div className="min-h-screen" />}>
          <Body/>  
        </Suspense>
      </PageProvider>
    </>
  );
}