import { Metadata } from 'next';
import { getPageData } from '@/app/components/hooks/hooks-server';
import PageProvider from '@/app/components/providers/page-provider';
import Header from '@/app/components/common/header';
import Footer from '@/app/components/common/footer';
import Sidebar from '@/app/components/common/sidebar';
import Navbar from '@/app/components/common/navbar';
import Diary from './diary';
import Segway from './segway';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'gallery');
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: data?.title || "Gallery | Moger Mulluk",
    description: data?.description,
    openGraph: {
      title: data?.title,
      description: data?.description,
      url: `${baseUrl}/${lang}/gallery`,
      images: [{url: data?.seo?.ogImage || "/favicon/apple-touch-icon.png", width: 1200, height: 630, alt: data?.title}],
      type: "website",
    },
    // Inside generateMetadata for gallery
alternates: {
  canonical: `${baseUrl}/${lang}/gallery`,
  languages: {
    'en': `${baseUrl}/en/gallery`,
    'bn': `${baseUrl}/bn/gallery`,
    'es': `${baseUrl}/es/gallery`,
    'hi': `${baseUrl}/hi/gallery`,
    'x-default': `${baseUrl}/en/gallery`,
  },
},
  };
}

export default async function GalleryPage() {
  return (
    <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
      <Diary />
      <Segway/>
    </PageProvider>
  );
}