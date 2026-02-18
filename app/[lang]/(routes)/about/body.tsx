'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Coffee, Leaf, Globe, Banknote, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { PageData } from "@/app/components/types";

// Use PageData type for better TS safety
interface AboutBodyProps {
  data: PageData;
}

export default function Body({ data }: AboutBodyProps) {
  const tLogo = useTranslations('Logo');
  const tCTA = useTranslations('CTA');
  const tFooter = useTranslations('Footer');
  const locale = useLocale();

  const getFontClass = (weight: 'bold' | 'black' | 'normal' = 'normal') => {
    const fonts = {
      bn: 'font-["Noto_Sans_Bengali"]',
      hi: 'font-["Noto_Sans_Devanagari"]',
      default: 'font-sans',
    };
    const font = fonts[locale as keyof typeof fonts] || fonts.default;
    if (weight === 'black') return `${font} font-black`;
    if (weight === 'bold') return `${font} font-bold`;
    return font;
  };

  const getRegionText = () => {
    switch(locale) {
      case 'bn': return 'ঢাকা থেকে বিশ্বজুড়ে';
      case 'es': return 'De Dhaka para el mundo';
      case 'hi': return 'ढाका से दुनिया तक';
      default: return 'From Dhaka to the World';
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#FFFBF8] dark:bg-stone-950 pb-20 transition-colors duration-300">
      
      {/* 1. HERO BANNER: NOW USES BACKEND VIDEO/IMG */}
      <section className="relative w-full h-[35vh] md:h-[50vh] bg-stone-200 dark:bg-stone-900 overflow-hidden">
        {data.video ? (
             <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
                <source src={data.video} type="video/mp4" />
             </video>
        ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#8A3D04]/5 dark:bg-orange-500/5">
                <ImageIcon size={48} className="text-[#8A3D04]/10 dark:text-orange-200/10 mb-2" />
            </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#FFFBF8] dark:from-stone-950 via-transparent to-transparent opacity-100" />
      </section>

      {/* 2. OVERLAPPING TITLE SECTION: USES BACKEND TITLE & DESCRIPTION */}
      <section className="relative z-20 -mt-10 md:-mt-16 text-center px-6">
        <div className="bg-white dark:bg-stone-900 inline-block px-8 py-6 md:px-12 md:py-10 shadow-xl dark:shadow-2xl dark:shadow-black/50 rounded-2xl border border-orange-50 dark:border-stone-800 max-w-[90vw]">
          <p className="text-[#B28869] font-bold tracking-[0.3em] uppercase text-[10px] mb-2">
            {getRegionText()}
          </p>
          <h1 className={`${getFontClass('black')} text-4xl md:text-6xl text-[#8A3D04] dark:text-orange-200 mb-2 tracking-tighter leading-tight`}>
            {data.title}
          </h1>
          <p className={`${getFontClass()} text-lg md:text-xl text-[#B28869] dark:text-stone-400 italic font-medium leading-relaxed`}>
            {data.description}
          </p>
        </div>
      </section>

      {/* 3. MULTINATIONAL IDENTITY */}
      <section className="py-16 px-6 text-center">
        <h2 className={`${getFontClass('black')} text-2xl md:text-3xl text-[#8A3D04]/80 dark:text-orange-200/60 uppercase tracking-widest`}>
          {tLogo('brandName')}
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4 text-[#B28869] opacity-60 text-xs font-bold uppercase tracking-widest">
           <span>Bangladesh</span> • <span>India</span> • <span>Spain</span> • <span>Global</span>
        </div>
      </section>

      {/* 4. GLOBAL STORY VIDEO SECTION: USES OG IMAGE AS FALLBACK */}
      <section className="max-w-5xl mx-auto w-full px-6 mb-24">
        <div className="relative aspect-video w-full bg-stone-900 rounded-4xl overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer border-8 border-white dark:border-stone-800">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-110 transition-transform duration-1000"
            style={{ backgroundImage: `url('${data.seo.ogImage || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop'}')` }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-full group-hover:bg-[#8A3D04] dark:group-hover:bg-orange-600 transition-all duration-500">
              <PlayCircle size={64} className="text-white" />
            </div>
            <p className="mt-6 text-white font-bold tracking-[0.2em] uppercase text-[10px] opacity-80">
              {data.videoUrl ? 'Watch Our Story' : 'Local Roots, Global Wings'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. VALUE PROPOSITIONS (Keep existing UI) */}
      <section className="w-full bg-white dark:bg-stone-900/50 py-24 border-y border-[#FDF2E9] dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Sustainability */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-700 dark:text-green-400">
                <Leaf size={32} />
              </div>
              <h3 className={`${getFontClass('bold')} text-lg text-[#8A3D04] dark:text-orange-200`}>
                {locale === 'bn' ? 'পরিবেশবান্ধব' : 'Eco-Global'}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                We replace one-time cups with biodegradable mugs across all franchises. A multinational commitment to a cleaner planet.
              </p>
            </div>

            {/* Fair Trade */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-700 dark:text-blue-400">
                <Globe size={32} />
              </div>
              <h3 className={`${getFontClass('bold')} text-lg text-[#8A3D04] dark:text-orange-200`}>
                {locale === 'bn' ? 'ন্যায্য কারবার' : 'Fair Trade'}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Global direct trade for tea and chocolate. From ES to BN, we ensure farmers receive a fair share of our success.
              </p>
            </div>

            {/* Premium Quality */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-[#FDF2E9] dark:bg-stone-800 rounded-2xl text-[#8A3D04] dark:text-orange-300">
                <Coffee size={32} />
              </div>
              <h3 className={`${getFontClass('bold')} text-lg text-[#8A3D04] dark:text-orange-200`}>
                {locale === 'bn' ? 'সেরা মান' : 'Premium Sips'}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Artisanal beans and leaves selected by global experts. High-end taste consistency in every country we serve.
              </p>
            </div>

            {/* Loot Prices */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl text-orange-700 dark:text-orange-400">
                <Banknote size={32} />
              </div>
              <h3 className={`${getFontClass('bold')} text-lg text-[#8A3D04] dark:text-orange-200`}>
                {locale === 'bn' ? 'লুট অফার!' : 'Loot Prices'}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Disrupting the market globally. We offer premium franchise quality at prices that feel like a &ldquo;loot.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COUNTERS & CTA (Existing UI) */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl font-black text-[#8A3D04] dark:text-orange-200">4+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#B28869]">Countries</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#8A3D04] dark:text-orange-200">100k+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#B28869]">Cups Served</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#8A3D04] dark:text-orange-200">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-[#B28869]">Eco-Friendly</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#8A3D04] dark:text-orange-200">1</p>
              <p className="text-[10px] uppercase tracking-widest text-[#B28869]">Vision</p>
            </div>
         </div>
      </section>

      <section className="pt-10 px-6 text-center">
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/menu" className="w-full sm:w-auto px-12 py-5 bg-[#8A3D04] dark:bg-orange-700 text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:-translate-y-1">
            {tCTA('orderNow')}
          </Link>
          <Link href="/faq" className="w-full sm:w-auto px-12 py-5 border-2 border-[#8A3D04] dark:border-orange-800 text-[#8A3D04] dark:text-orange-200 rounded-xl font-bold hover:bg-[#8A3D04] dark:hover:bg-orange-800 hover:text-white transition-all">
            {tFooter('quickLinks')}
          </Link>
        </div>
      </section>
    </div>
  );
}