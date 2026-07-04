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
      images: [ "/favicon/apple-touch-icon.png"],
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
                Order Page
            </div>
        </PageProvider>
     );
}
 
export default OrderPage;