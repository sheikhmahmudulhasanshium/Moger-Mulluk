import { getTranslations } from 'next-intl/server';
import { MasterFAQ } from "@/lib/data"; // Make sure this path is correct
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
  
  // Get the actual data for this language
  const activeFAQ = MasterFAQ[lang.toUpperCase()] || MasterFAQ.EN;
  
  // 1. THE WHATSAPP HACK: 
  // We take the first 3 questions and join them into a string
  const questionPreview = activeFAQ.items
    .slice(0, 3)
    .map(item => `• ${item.question}`)
    .join(' ');

  // Create a combined description for social media
  const socialDescription = `${t('description')} Questions covered: ${questionPreview}`;

  return {
    title: t('title'),
    description: socialDescription, // This helps WhatsApp see the questions
    openGraph: {
      title: `${t('title')} | ${brand('brandName')}`,
      description: socialDescription,
      url: `https://moger-mulluk.vercel.app/${lang}/faq`,
      siteName: brand('brandName'),
      images: [
        {
          url: '/favicon/apple-touch-icon.png', 
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
      description: socialDescription,
    },
  };
}

export default async function FAQs({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeFAQ = MasterFAQ[lang.toUpperCase()] || MasterFAQ.EN;

  // JSON-LD for GOOGLE (Amazon Style)
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
        <Body/>  
      </PageProvider>
    </>
  );
}