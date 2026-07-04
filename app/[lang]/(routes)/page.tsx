import { Metadata } from "next";
import { getPageData } from "@/app/components/hooks/hooks-server";
import { notFound } from "next/navigation";
import PageProvider from "../../components/providers/page-provider";
import Body from "../home/body";
import Header from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";

// 1. GENERATE METADATA
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'home');
  const baseUrl = "https://moger-mulluk.vercel.app";
  const fallbackImage = `${baseUrl}/favicon/web-app-manifest-512x512.png`;

  if (!data) return { title: "Moger Mulluk" };

  // SEO FIX: Stretch the title and description to satisfy the SEO Report
  const optimizedTitle = `${data.title} | Moger Mulluk - Premium Tea & Artisanal Coffee`;
  const optimizedDesc = `${data.description}. Experience the best tea, coffee, and hangout spots in Dhaka. Join us for a legendary cafe experience with global branches.`;

  // IMAGE FIX: Social media ignores SVGs. If backend has .svg, use PNG fallback.
  const rawOgImage = data.seo.ogImage || fallbackImage;
  const finalOgImage = rawOgImage.endsWith('.svg') ? fallbackImage : rawOgImage;

  return {
    metadataBase: new URL(baseUrl),
    title: optimizedTitle,
    description: optimizedDesc,
    keywords: [...(data.seo.keywords || []), "cafe dhaka", "best tea shop", "coffee house dhaka"],
    
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'bn': '/bn',
        'es': '/es',
        'hi': '/hi',
      },
    },

    openGraph: {
      title: optimizedTitle,
      description: optimizedDesc,
      url: `/${lang}`,
      siteName: 'Moger Mulluk',
      images: [
        {
          url: finalOgImage, 
          width: 1200,
          height: 630,
          alt: optimizedTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDesc,
      images: [finalOgImage],
    },
    robots: {
      index: !data.seo.isNoIndex,
      follow: !data.seo.isNoIndex,
    }
  };
}

// 2. PAGE COMPONENT
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const data = await getPageData(lang, 'home');
  const baseUrl = "https://moger-mulluk.vercel.app";

  if (!data) {
    notFound();
  }

  // STARBUCKS-STYLE STRUCTURED DATA (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CafeOrCoffeeShop",
        "@id": `${baseUrl}/${lang}/#organization`,
        "name": "Moger Mulluk",
        "url": `${baseUrl}/${lang}`,
        "logo" : `${baseUrl}/favicon/web-app-manifest-512x512.png`,
        "image": `${baseUrl}/favicon/web-app-manifest-512x512.png`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sector 3, Uttara",
          "addressLocality": "Dhaka",
          "addressCountry": "BD"
        },
        "location": [
          { "@type": "Cafe", "name": "Moger Mulluk - Banani", "address": "Road 11, Banani, Dhaka" },
          { "@type": "Cafe", "name": "Moger Mulluk - Dhanmondi", "address": "Satmasjid Rd, Dhaka" },
          { "@type": "Cafe", "name": "Moger Mulluk - Kolkata", "address": "West Bengal, India" },
          { "@type": "Cafe", "name": "Moger Mulluk - Madrid", "address": "Madrid Central, Spain" }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/${lang}/#website`,
        "url": `${baseUrl}/${lang}`,
        "name": "Moger Mulluk",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/${lang}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ItemList",
        "name": "Main Menu",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Kingdom Menu", "url": `${baseUrl}/${lang}/menu` },
          { "@type": "ListItem", "position": 2, "name": "Special Offers", "url": `${baseUrl}/${lang}/offers` },
          { "@type": "ListItem", "position": 3, "name": "Our Locations", "url": `${baseUrl}/${lang}/locations` }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <PageProvider 
        header={<Header/>} 
        footer={<Footer/>} 
        sidebar={<Sidebar/>} 
        navbar={<Navbar/>}
      >
        <Body data={data} />  
      </PageProvider>
    </>
  );
}