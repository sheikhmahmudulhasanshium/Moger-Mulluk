//import Image from "next/image";

import Footer from "@/app/components/common/footer";
import PageProvider from "../../../components/providers/page-provider";
import { useLocale } from "next-intl";
import LocalSwitcher from "@/app/components/buttons/lang-switcher";
import Header from "@/app/components/common/header";
import { getTranslations } from "next-intl/server";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Use 'FAQ' namespace from your JSON
  const t = await getTranslations({ locale: lang, namespace: 'FAQPage' });

  return {
    title: t('title'), // This string replaces the "%s" in your layout template
  };
}

export default function NoticeBoard() {
    const localActive = useLocale(); // Returns 'en' or 'bn'
  
  return (
    <>
      <PageProvider header={<Header/>} footer={<Footer/>} >
         Current Language: {localActive}
            <LocalSwitcher/>
          
      </PageProvider>
    </>
     );
}
