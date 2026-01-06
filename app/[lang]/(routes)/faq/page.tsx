import { Suspense } from "react"; // Added Suspense
import { getTranslations } from 'next-intl/server';
import { MasterFAQ } from "@/lib/data";
import PageProvider from "../../../components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Body from "./body";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";

export async function generateMetadata({ params, searchParams }: { 
  params: Promise<{ lang: string }>, 
  searchParams: Promise<{ id?: string }> 
}) {
  const { lang } = await params;
  const { id } = await searchParams;
  const t = await getTranslations({ locale: lang, namespace: 'FAQPage' });
  const brand = await getTranslations({ locale: lang, namespace: 'Logo' });
  
  const activeFAQ = MasterFAQ[lang.toUpperCase()] || MasterFAQ.EN;
  const sharedItem = activeFAQ.items.find(item => item.id === id);

  const finalTitle = sharedItem ? sharedItem.question : t('title');
  const finalDesc = sharedItem ? sharedItem.answer : t('description');

  return {
    title: finalTitle,
    description: finalDesc,
    openGraph: {
      title: `${finalTitle} | ${brand('brandName')}`,
      description: finalDesc,
      url: `https://moger-mulluk.vercel.app/${lang}/faq${id ? `?id=${id}` : ''}`,
      siteName: brand('brandName'),
      images: [{ url: '/favicon/apple-touch-icon.png' }],
      locale: lang,
      type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDesc,
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