//import Image from "next/image";

import Footer from "@/app/components/common/footer";
import PageProvider from "../../../components/providers/page-provider";
import { useLocale } from "next-intl";
import LocalSwitcher from "@/app/components/buttons/lang-switcher";
import Header from "@/app/components/common/header";

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
