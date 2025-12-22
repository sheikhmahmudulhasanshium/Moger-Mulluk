import { getTranslations } from 'next-intl/server'; // Import this
import PageProvider from "../../../components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Body from "./body";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";

// 1. ADD THIS PART:
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Use 'FAQ' namespace from your JSON
  const t = await getTranslations({ locale: lang, namespace: 'AboutPage' });

  return {
    title: t('title'), // This string replaces the "%s" in your layout template
  };
}

export default function AboutPage() {
  return (
    <>
      <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
        <Body/>  
      </PageProvider>
    </>
  );
}