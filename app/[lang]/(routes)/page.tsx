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
  const fallbackImage = "/favicon/apple-touch-icon.png";

  if (!data) return { title: "Moger Mulluk" };

  return {
    metadataBase: new URL(baseUrl),
    title: data.title,
    description: data.description,
    keywords: data.seo.keywords,
    
    // Fix: Add all 4 languages to help Google index them correctly
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
      title: data.title,
      description: data.description,
      url: `/${lang}`, // Uses relative path, metadataBase makes it absolute
      siteName: 'Moger Mulluk',
      images: [
        {
          url: data.seo.ogImage || fallbackImage, 
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.seo.ogImage || fallbackImage],
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
  // This tells Google to show sub-links and a search box in search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Moger Mulluk",
        "url": `${baseUrl}/${lang}`,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/${lang}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ItemList",
        "name": "Quick Links",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Menu",
            "url": `${baseUrl}/${lang}/page`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Locations",
            "url": `${baseUrl}/${lang}/locations`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Offers",
            "url": `${baseUrl}/${lang}/offers`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "About Us",
            "url": `${baseUrl}/${lang}/about`
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* Inject Structured Data into the page */}
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