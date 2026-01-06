import { getTranslations } from 'next-intl/server';
import { MasterFAQ } from "@/lib/data"; // Import your FAQ data
import PageProvider from "../../../components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Body from "./body";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'FAQPage' });
  const brand = await getTranslations({ locale: lang, namespace: 'Logo' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | ${brand('brandName')}`,
      description: t('description'),
      url: `https://moger-mulluk.vercel.app/${lang}/faq`,
      siteName: brand('brandName'),
      images: [
        {
          url: '/favicon/apple-touch-icon.png', // Or your specific OG image
          width: 800,
          height: 600,
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function FAQs({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeFAQ = MasterFAQ[lang.toUpperCase()] || MasterFAQ.EN;

  // This is the MAGIC for Amazon-style search results (Structured Data)
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
      {/* Injecting the Schema into the page head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
        <Body/>  
      </PageProvider>
    </>
  );
}