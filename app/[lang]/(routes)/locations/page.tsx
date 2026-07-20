import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import PageProvider from "@/app/components/providers/page-provider";
import GlobalFootprint from "../../home/global-trace";
import HeroSection from "./hero";
import { getPageData } from "@/app/components/hooks/hooks-server";
import { Metadata } from "next";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const data = await getPageData(lang, 'locations'); // Use 'gallery' for gallery page
  const baseUrl = "https://moger-mulluk.vercel.app";

  return {
    title: data?.title || "Locations",
    description: data?.description,
    openGraph: {
      title: data?.title,
      description: data?.description,
      images: [{url: data?.seo?.ogImage || "/favicon/web-app-manifest-512x512.png", width: 1200, height: 630, alt: data?.title}],
      type: "website",
      url: `${baseUrl}/${lang}/locations`
    },
// Inside your menu/page.tsx generateMetadata function:
alternates: {
   canonical: lang === 'en' ? `${baseUrl}/locations` : `${baseUrl}/${lang}/locations`,
  languages: {
    'en': `${baseUrl}/locations`,      // UPDATE THIS: Remove "/en"
    'bn': `${baseUrl}/bn/locations`,
    'es': `${baseUrl}/es/locations`,
    'hi': `${baseUrl}/hi/locations`,
  },
},    twitter: {
      title: data?.title,
      description: data?.description,      
      card: 'summary_large_image',
      images: [{url: data?.seo?.ogImage || "/favicon/web-app-manifest-512x512.png", width: 1200, height: 630, alt: data?.title}],   
  }
}}
const LocationsPage = () => {
    return (
        <PageProvider header={<Header/>} footer={<Footer/>} navbar={<Navbar/>} sidebar={<Sidebar/>}>
            {/* 1. Cinematic Intro */}
            <HeroSection/>

            {/* 2. Interactive Map & Selection */}
            <GlobalFootprint/>
            
            {/* Optional: Add a call-to-action for franchisees or events here */}
        </PageProvider>
    );
}

export default LocationsPage;