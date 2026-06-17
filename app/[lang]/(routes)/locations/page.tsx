import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Navbar from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";
import PageProvider from "@/app/components/providers/page-provider";
import GlobalFootprint from "../../home/global-trace";
import HeroSection from "./hero";

const LocationsPage = () => {
    return (
        <PageProvider header={<Header/>} footer={<Footer/>} navbar={<Navbar/>} sidebar={<Sidebar/>}>
            {/* 1. Cinematic Intro */}
            <HeroSection/>

            {/* 2. Interactive Map & Selection */}
            <GlobalFootprint/>
            
            {/* Optional: Add a call-to-action for franchisees or events here */}
        </PageProvider>
    );
}

export default LocationsPage;