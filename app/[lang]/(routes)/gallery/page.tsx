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

  // FIX: Use a high-res fallback banner, not a favicon
  const ogImageUrl = `${baseUrl}/favicon/web-app-manifest-512x512.png`;

  return {
    title: data?.title || "Gallery | Moger Mulluk",
    description: data?.description,
    
    // FIX: Clear the fb:app_id warning
    facebook: {
      appId: '2151814335752206',
    },

    // Inside your menu/page.tsx generateMetadata function:
alternates: {
   canonical: lang === 'en' ? `${baseUrl}/gallery` : `${baseUrl}/${lang}/gallery`,
  languages: {
    'en': `${baseUrl}/gallery`,      // UPDATE THIS: Remove "/en"
    'bn': `${baseUrl}/bn/gallery`,
    'es': `${baseUrl}/es/gallery`,
    'hi': `${baseUrl}/hi/gallery`,
  },
},

    openGraph: {
      title: data?.title || "Gallery",
      description: data?.description,
      url: `${baseUrl}/${lang}/gallery`,
      type: "website",
      // FIX: Absolute URL + Mandatory Width/Height
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: data?.title || "Moger Mulluk Gallery",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    }
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