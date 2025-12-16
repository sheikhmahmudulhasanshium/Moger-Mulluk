//import Image from "next/image";

import PageProvider from "../../../components/providers/page-provider";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Body from "./body";
import Sidebar from "@/app/components/common/sidebar";
import Navbar from "@/app/components/common/navbar";

export default function FAQs() {
  
  return (
    <>
      <PageProvider header={<Header/>} footer={<Footer/>} sidebar={<Sidebar/>} navbar={<Navbar/>}>
        <Body/>  
      </PageProvider>
    </>
     );
}
