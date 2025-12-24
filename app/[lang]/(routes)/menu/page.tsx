import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import PageProvider from "@/app/components/providers/page-provider";
import { getTranslations } from "next-intl/server";
import Body from "./body";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  
  // Use 'Navigation' namespace because that's where "menu" is defined in your JSON
  const t = await getTranslations({ locale, namespace: 'Navigation' });

  return {
    title: t('menu'), // This will return "Menu" or "মেনু" based on the language
  };
}

const MenuPage = () => {
    return ( 
        <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
            <Body/>
        </PageProvider>
     );
}
 
export default MenuPage;