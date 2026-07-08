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
    title: "Orders | Moger Mulluk",
    description: "Place your orders for our delicious offerings at Moger Mulluk. From freshly brewed coffee to delectable desserts, we have something for every taste.",
    openGraph: {
      title: 'Orders | Moger Mulluk',
      description: 'Place your orders for our delicious offerings at Moger Mulluk. From freshly brewed coffee to delectable desserts, we have something for every taste.',
      url: `/${lang}/order`,
      images: [ "/favicon/web-app-manifest-512x512.png" ],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/order`,
    }
  };
}
const OrderPage = () => {
    return ( 
        <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
            <div>
                This Page is under construction. Please check back later for updates on our ordering system. We will let you know when the system is ready. We appreciate your patience and look forward to serving you soon!
            </div>
        </PageProvider>
     );
}
 
export default OrderPage;