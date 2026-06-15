import { getTranslations, getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Link from "next/link";
import { MoveLeft } from "lucide-react"; 
import Footer from "../components/common/footer";
import Header from "../components/common/header";
import Navbar from "../components/common/navbar";
import Sidebar from "../components/common/sidebar";
import PageProvider from "../components/providers/page-provider";
import { Button } from "@/components/ui/button";
import NotFoundVisual from "../components/common/not-found-visual";

export default async function NotFound() {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations('NotFound');

  const getFontClass = () => {
    switch (locale) {
      case 'bn': return 'font-["Noto_Sans_Bengali"]';
      case 'hi': return 'font-["Noto_Sans_Devanagari"]';
      default: return 'font-sans';
    }
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PageProvider 
        header={<Header/>} 
        footer={<Footer/>} 
        sidebar={<Sidebar/>} 
        navbar={<Navbar/>}
      >
        <div className={`flex flex-col items-center justify-center min-h-[75vh] px-6 py-12 ${getFontClass()}`}>
          
          {/* Visual SVG Component */}
          <NotFoundVisual />

          {/* Multilingual Content */}
          <div className="mt-12 text-center max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-[#8A3D04] dark:text-amber-500 mb-6 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-lg md:text-xl text-amber-900/60 dark:text-amber-100/60 mb-10 leading-relaxed">
              {t('description')}
            </p>

            <Button 
              asChild 
              variant="outline"
              className="group relative border-2 border-[#8A3D04] dark:border-amber-500 text-[#8A3D04] dark:text-amber-500 hover:bg-[#8A3D04] dark:hover:bg-amber-500 hover:text-white dark:hover:text-black px-10 py-8 rounded-2xl transition-all duration-300 font-black text-xl shadow-xl hover:shadow-2xl"
            >
              <Link href="/" className="flex items-center gap-4">
                <MoveLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                {t('goBack')}
              </Link>
            </Button>
          </div>
        </div>
      </PageProvider>
    </NextIntlClientProvider>
  );
}