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
// 1. GENERATE METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const baseUrl = "https://moger-mulluk.vercel.app";
  const locale = (lang as Locale) || 'en';
  const fallbackImage = "/favicon/apple-touch-icon.png";

  try {
    const offer = await offerApi.getById(id);
    if (!offer) throw new Error();

    // 1. Get localized strings
    const productTitle = offer.title[locale] || offer.title['en'];
    const discountText = offer.discount[locale] || offer.discount['en'];
    
    // 2. Create a localized "on" or separator
    let fullTitle = "";
    if (locale === 'bn') {
      // Result: "সতেজ গ্রিন টি 🍵-এ ৫ টাকা ছাড়"
      fullTitle = `${productTitle}-এ ${discountText}`;
    } else if (locale === 'hi') {
      // Result: "ग्रीन डिटॉक्स 🍵 पर ৳5 छूट"
      fullTitle = `${productTitle} पर ${discountText}`;
    } else if (locale === 'es') {
      // Result: "৳5 Dto en Detox Verde 🍵"
      fullTitle = `${discountText} en ${productTitle}`;
    } else {
      // Result: "৳5 OFF on Green Detox 🍵"
      fullTitle = `${discountText} on ${productTitle}`;
    }

    const description = offer.description[locale] || offer.description['en'];
    const image = offer.displayImage || offer.media?.image || fallbackImage;

    return {
      metadataBase: new URL(baseUrl),
      title: `${fullTitle} | Moger Mulluk`,
      description: description,
      openGraph: {
        title: fullTitle, // Shows the discount in the big bold link preview text
        description: description,
        url: `/${lang}/offers/${id}`,
        siteName: "Moger Mulluk",
        images: [{ url: image, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: description,
        images: [image],
      }
    };
  } catch {
    return {
      metadataBase: new URL(baseUrl),
      title: "Special Offer | Moger Mulluk",
      openGraph: { images: [fallbackImage] }
    };
  }
}// 2. SSG: Pre-render most popular offers at build time
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