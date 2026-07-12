'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Coffee, Leaf, Globe, Banknote } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { PageData } from "@/app/components/types";

const Counter = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    } else {
      count.set(0);
    }
  }, [inView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

interface AboutBodyProps {
  data: PageData;
}

export default function Body({ data }: AboutBodyProps) {
  const tLogo = useTranslations('Logo');
  const tCTA = useTranslations('CTA');
  const tFooter = useTranslations('Footer');
  const locale = useLocale();

  const getEmbedUrl = (url: unknown): string => {
    if (typeof url !== 'string' || !url) return '';
    let videoId = '';
    if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0] ?? '';
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0] ?? '';
    else videoId = url.split('/').pop() ?? '';
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const getFontClass = (weight: 'bold' | 'black' | 'normal' = 'normal') => {
    const fonts = { bn: 'font-["Noto_Sans_Bengali"]', hi: 'font-["Noto_Sans_Devanagari"]', default: 'font-sans' };
    const font = fonts[locale as keyof typeof fonts] || fonts.default;
    return weight === 'black' ? `${font} font-black` : weight === 'bold' ? `${font} font-bold` : font;
  };

  const getRegionText = () => {
    switch(locale) {
      case 'bn': return 'ঢাকা থেকে বিশ্বজুড়ে';
      case 'es': return 'De Dhaka para el mundo';
      case 'hi': return 'ढाका से दुनिया तक';
      default: return 'From Dhaka to the World';
    }
  };

  const displayOgImage = data.seo?.ogImage || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop';
  const storyVideoUrl = (typeof data.videoUrl === 'string' ? data.videoUrl : null) || (typeof data.video === 'string' ? data.video : null);

  const typewriterContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const letterVariants = {
    hidden: { opacity: 0, display: 'none' },
    visible: { opacity: 1, display: 'inline', transition: { duration: 0 } }
  };

  return (
    <div className="flex flex-col w-full bg-[#FFFBF8] dark:bg-stone-950 pb-20 transition-colors duration-300 overflow-x-hidden">
      
      {/* 1. HERO BANNER - FIXED LCP */}
      <section className="relative w-full h-[55vh] md:h-[75vh] bg-stone-200 dark:bg-stone-900 overflow-hidden">
        <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10 }}
            className="absolute inset-0 opacity-70 grayscale-10"
        >
          {/* Replaced background-image with highly optimized Next Image */}
          <Image
            src={displayOgImage}
            alt={data.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-[#FFFBF8] dark:from-stone-950 via-transparent to-transparent opacity-100" />
      </section>

      {/* 2. OVERLAPPING TITLE SECTION */}
      <section className="relative z-20 -mt-40 md:-mt-80 text-center px-6">
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            className="bg-white dark:bg-stone-900 inline-block px-8 py-10 md:px-20 md:py-20 shadow-2xl rounded-[3rem] md:rounded-[5rem] border border-orange-50 dark:border-stone-800 max-w-[90vw]"
        >
          {/* FIX: Improved contrast for region identity */}
          <p className="text-[#8A3D04] dark:text-orange-300 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4">
            {getRegionText()}
          </p>

          <motion.h1 
            variants={typewriterContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className={`${getFontClass('black')} text-3xl md:text-7xl text-[#8A3D04] dark:text-orange-200 mb-6 tracking-tighter leading-tight`}
          >
            {data.title.split("").map((char, i) => (
              <motion.span key={i} variants={letterVariants}>{char}</motion.span>
            ))}
          </motion.h1>

          {/* FIX: Darker brown (#5C3A21) for improved accessibility text contrast */}
          <p className={`${getFontClass()} text-lg md:text-2xl text-[#5C3A21] dark:text-stone-300 italic font-medium leading-relaxed max-w-3xl mx-auto`}>
            {data.description}
          </p>
        </motion.div>
      </section>

      {/* 3. BRAND IDENTITY */}
      <section className="py-20 px-6 text-center">
        <h2 className={`${getFontClass('black')} text-2xl md:text-3xl text-[#8A3D04]/80 dark:text-orange-200/60 uppercase tracking-widest`}>
          {tLogo('brandName')}
        </h2>
        {/* FIX: Improved contrast by removing opacity-60 and darkening the color */}
        <div className="flex items-center justify-center gap-4 mt-4 text-[#5C3A21] dark:text-orange-200/80 text-xs font-bold uppercase tracking-widest">
           <span>Bangladesh</span> • <span>India</span> • <span>Spain</span> • <span>USA</span> • <span>Global</span>
        </div>
      </section>

      {/* 4. GLOBAL STORY VIDEO */}
      <section className="max-w-6xl mx-auto w-full px-6 mb-32">
        <div className="relative aspect-video w-full bg-stone-900 rounded-4xl overflow-hidden shadow-2xl border-10 md:border-20 border-white dark:border-stone-800">
          {storyVideoUrl && (
            <iframe 
              className="absolute inset-0 w-full h-full" 
              src={getEmbedUrl(storyVideoUrl)} 
              allow="autoplay; encrypted-media; picture-in-picture" 
              allowFullScreen 
              title={`${data.title} - Video`} // FIX: Added accessible title
              loading="lazy" // FIX: Defers load to unblock Main JS Thread execution
            />
          )}
        </div>
      </section>

      {/* 5. VALUE PROPOSITIONS */}
      <section className="w-full bg-white dark:bg-stone-900/50 py-32 border-y border-[#FDF2E9] dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-3xl text-green-700 dark:text-green-400"><Leaf size={32} /></div>
              <h3 className={`${getFontClass('bold')} text-xl text-[#8A3D04] dark:text-orange-200`}>{locale === 'bn' ? 'পরিবেশবান্ধব' : 'Eco-Global'}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed px-2">We replace one-time cups with biodegradable mugs across all franchises. A multinational commitment to a cleaner planet.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-3xl text-blue-700 dark:text-blue-400"><Globe size={32} /></div>
              <h3 className={`${getFontClass('bold')} text-xl text-[#8A3D04] dark:text-orange-200`}>{locale === 'bn' ? 'ন্যায্য কারবার' : 'Fair Trade'}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed px-2">Global direct trade for tea and chocolate ensuring farmers receive a fair share of our success.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-5 bg-[#FDF2E9] dark:bg-stone-800 rounded-3xl text-[#8A3D04] dark:text-orange-300"><Coffee size={32} /></div>
              <h3 className={`${getFontClass('bold')} text-xl text-[#8A3D04] dark:text-orange-200`}>{locale === 'bn' ? 'সেরা মান' : 'Premium Sips'}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed px-2">Artisanal beans and leaves selected by global experts for consistent high-end taste.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-5 bg-orange-50 dark:bg-orange-950/40 rounded-3xl text-orange-700 dark:text-orange-400"><Banknote size={32} /></div>
              <h3 className={`${getFontClass('bold')} text-xl text-[#8A3D04] dark:text-orange-200`}>{locale === 'bn' ? 'লুট অফার!' : 'Loot Prices'}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed px-2">Disrupting the market globally with premium franchise quality at prices that feel like a loot.</p>
            </div>
        </div>
      </section>

      {/* 6. INFOGRAPHIC SECTION */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
                { val: 4, suffix: "+", lab: "Countries" },
                { val: 100, suffix: "k+", lab: "Cups Served" },
                { val: 100, suffix: "%", lab: "Eco-Friendly" },
                { val: 1, suffix: "", lab: "Vision" }
            ].map((stat, i) => (
                <motion.div 
                    key={i}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                    <p className={`${getFontClass('black')} text-4xl md:text-5xl text-[#8A3D04] dark:text-orange-200`}>
                        <Counter value={stat.val} />{stat.suffix}
                    </p>
                    {/* FIX: Improved contrast */}
                    <p className="text-[10px] uppercase tracking-widest text-[#5C3A21] dark:text-stone-400 font-bold mt-2">{stat.lab}</p>
                </motion.div>
            ))}
         </div>
      </section>

      <section className="pb-20 px-6 text-center">
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link 
            href="/menu" 
            aria-label="Order now from the Moger Mulluk menu" // FIX: Differentiation for screen readers
            className="w-full sm:w-auto px-16 py-6 bg-[#8A3D04] dark:bg-orange-700 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
          >
            {tCTA('orderNow')}
          </Link>
          <Link href="/faq" className="w-full sm:w-auto px-16 py-6 border-2 border-[#8A3D04] dark:border-orange-800 text-[#8A3D04] dark:text-orange-200 rounded-2xl font-bold hover:bg-[#8A3D04] hover:text-white transition-all">
            {tFooter('quickLinks')}
          </Link>
        </div>
      </section>
    </div>
  );
}