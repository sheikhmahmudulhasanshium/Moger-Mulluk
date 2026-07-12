import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import PageProvider from "@/app/components/providers/page-provider";
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