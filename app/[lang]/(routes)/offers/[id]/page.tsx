// app/[lang]/(routes)/offers/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { offerApi } from "@/app/components/hooks/offer-api";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";
import PageProvider from "@/app/components/providers/page-provider";
import Body from "./body";
import { Locale } from "@/app/components/types";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

// 1. GENERATE METADATA (For SEO & Link Previews)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const baseUrl = "https://moger-mulluk.vercel.app";
  const locale = lang as Locale;
  
  try {
    const offer = await offerApi.getById(id);
    const title = offer.title[locale] || offer.title['en'];
    const description = offer.description[locale] || offer.description['en'];
    const image = offer.displayImage || offer.media.image;

    return {
      title: `${title} | Moger Mulluk`,
      description: description,
      alternates: {
        canonical: `${baseUrl}/${lang}/offers/${id}`,
        languages: {
          'en': `${baseUrl}/en/offers/${id}`,
          'bn': `${baseUrl}/bn/offers/${id}`,
          'es': `${baseUrl}/es/offers/${id}`,
          'hi': `${baseUrl}/hi/offers/${id}`,
          'x-default': `${baseUrl}/en/offers/${id}`,
        },
      },
      openGraph: {
        title: title,
        description: description,
        url: `${baseUrl}/${lang}/offers/${id}`,
        siteName: "Moger Mulluk",
        images: [{ url: image, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [image],
      }
    };
  } catch {
    return { title: "Offer Not Found | Moger Mulluk" };
  }
}

// 2. SSG: Pre-render most popular offers at build time
export async function generateStaticParams() {
    try {
        const offers = await offerApi.getAllIds();
        const langs = ['en', 'bn', 'hi', 'es'];
        
        return offers.flatMap((offer) => 
            langs.map((lang) => ({
                lang,
                id: offer.id,
            }))
        );
    } catch {
        return [];
    }
}

// 3. PAGE COMPONENT
const OfferDetailPage = async ({ params }: Props) => {
    const { lang, id } = await params;

    let offer;
    try {
        offer = await offerApi.getById(id);
    } catch {
        notFound();
    }

    return ( 
        <PageProvider 
            header={<Header/>} 
            footer={<Footer/>} 
            sidebar={<Sidebar/>} 
            navbar={<Navbar/>}
        >
            {/* Pass data to Client Body to avoid double-fetching */}
            <Body offer={offer} locale={lang as Locale} />
        </PageProvider>
    );
}
 
export default OfferDetailPage;