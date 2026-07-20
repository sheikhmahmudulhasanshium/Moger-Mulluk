import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import PageProvider from "@/app/components/providers/page-provider";
import { Metadata } from "next";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = "https://moger-mulluk.vercel.app"; 
    return {
       title: "Coffee vs Tea | Moger Mulluk",
    description: "Explore the delightful world of beverages at Moger Mulluk. Discover the unique flavors and benefits of coffee and tea, and find your perfect cup.",
    openGraph: {
      title: 'Coffee vs Tea | Moger Mulluk',
      description: 'Explore the delightful world of beverages at Moger Mulluk. Discover the unique flavors and benefits of coffee and tea, and find your perfect cup.',
      url: `/${lang}/order/coffee-vs-tea`,
      images: [ "/favicon/web-app-manifest-512x512.png" ],
    },
    // Inside your menu/page.tsx generateMetadata function:
alternates: {
   canonical: lang === 'en' ? `${baseUrl}/order/coffee-vs-tea` : `${baseUrl}/${lang}/order/coffee-vs-tea`,
  languages: {
    'en': `${baseUrl}/order/coffee-vs-tea`,      // UPDATE THIS: Remove "/en"
    'bn': `${baseUrl}/bn/order/coffee-vs-tea`,
    'es': `${baseUrl}/es/order/coffee-vs-tea`,
    'hi': `${baseUrl}/hi/order/coffee-vs-tea`,
  },
}
  };
    };

const CoffeVsTea = () => {
    return (  
        <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
            <div>
                This Page is under construction. Please check back later for updates on our ordering system. We will let you know when the system is ready. We appreciate your patience and look forward to serving you soon!
            </div>
        </PageProvider>
    );
}
 
export default CoffeVsTea;