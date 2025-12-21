//import Image from "next/image";

import PageProvider from "../../components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Body from "../home/body";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";
import { getTranslations } from "next-intl/server";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Use 'FAQ' namespace from your JSON
  const t = await getTranslations({ locale: lang, namespace: 'HomePage' });

  return {
    title: t('title'), // This string replaces the "%s" in your layout template
  };
}

export default function HomePage() {
  
  return (
    <>
      <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
        <Body/>  
      </PageProvider>
    </>
     );
}
