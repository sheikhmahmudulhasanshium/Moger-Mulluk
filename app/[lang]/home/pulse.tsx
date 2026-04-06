"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { Swords, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const translations = {
  en: {
    title: "The Great \n Struggle",
    subtitle: "A Massive Shift in the Realm",
    reason: "Every order is a pull. The side that dominates the season-end claims the Direct Donation Fund for local community development.",
    readMore: "Learn More",
    coffeeTeam: "Team Coffee",
    teaTeam: "Team Tea",
    ctaBattle: "Join the Epic Battle",
    supportText: "Support your team via every order",
  },
  bn: {
    title: "মহাসংগ্রামের \n প্রতাপ",
    subtitle: "সাম্রাজ্যের ভারসাম্য পরিবর্তন",
    reason: "প্রতিটি অর্ডার একটি টান। সিজন শেষে যে পক্ষ আধিপত্য বিস্তার করবে, তারা সরাসরি অনুদান তহবিল লাভ করবে।",
    readMore: "বিস্তারিত",
    coffeeTeam: "টিম কফি",
    teaTeam: "টিম চা",
    ctaBattle: "মহাযুদ্ধে যোগ দিন",
    supportText: "প্রতিটি অর্ডারের মাধ্যমে আপনার দলকে জেতান",
  },
  hi: {
    title: "महा \n संघर्ष",
    subtitle: "साम्राज्य का संतुलन बदल रहा है",
    reason: "हर ऑर्डर एक खिंचाव है। जो पक्ष सीजन के अंत में हावी होगा, वह स्थानीय सामुदायिक विकास के लिए प्रत्यक्ष दान कोष का दावा करेगा।",
    readMore: "विवरण देखें",
    coffeeTeam: "टीम कॉफी",
    teaTeam: "टीम चाय",
    ctaBattle: "युद्ध में शामिल हों",
    supportText: "हर ऑर्डर के साथ अपनी टीम का समर्थन करें",
  },
  es: {
    title: "La Gran \n Lucha",
    subtitle: "Un Cambio en el Reino",
    reason: "Cada pedido es un tirón. El bando que domine al final de la temporada reclamará el Fondo de Donación Directa.",
    readMore: "Leer más",
    coffeeTeam: "Team Café",
    teaTeam: "Team Té",
    ctaBattle: "Únete a la Batalla",
    supportText: "Apoya a tu equipo con cada pedido",
  }
};

const STAGES = [
  { id: 0, path: "/play/stage-2.png", level: -2 },
  { id: 1, path: "/play/stage-1.png", level: -1 },
  { id: 2, path: "/play/stage0.png",  level: 0  },
  { id: 3, path: "/play/stage+1.png", level: 1  },
  { id: 4, path: "/play/stage+2.png", level: 2  },
];

export default function ThePulse() {
  const locale = useLocale() as keyof typeof translations;
  const t = translations[locale] || translations.en;
  const isIndic = locale === 'bn' || locale === 'hi';

  const [coffeeWeight, setCoffeeWeight] = useState(50);
  const [currentFrame, setCurrentFrame] = useState(2); 
  const [direction, setDirection] = useState(0); 

  useEffect(() => {
    const sequence = [95, 10, 50, 85, 20, 50]; 
    let i = 0;
    const interval = setInterval(() => {
      setCoffeeWeight(sequence[i]);
      i = (i + 1) % sequence.length;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let targetFrame = 2;
    if (coffeeWeight >= 80) targetFrame = 4;
    else if (coffeeWeight > 50) targetFrame = 3;
    else if (coffeeWeight <= 20) targetFrame = 0;
    else if (coffeeWeight < 50) targetFrame = 1;

    if (currentFrame !== targetFrame) {
      const timer = setTimeout(() => {
        if (currentFrame < targetFrame) {
          setDirection(-1); 
          setCurrentFrame(prev => prev + 1);
        } else {
          setDirection(1); 
          setCurrentFrame(prev => prev - 1);
        }
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [coffeeWeight, currentFrame]);

  const holoImpact = useMemo(() => {
    const lvl = STAGES[currentFrame].level;
    if (lvl === 2) return { x: "-2%", rotateZ: -2 };
    if (lvl === 1) return { x: "-1%", rotateZ: -1 }; 
    if (lvl === -1) return { x: "1%", rotateZ: 1 };
    if (lvl === -2) return { x: "2%", rotateZ: 2 }; 
    return { x: "0%", rotateZ: 0 };
  }, [currentFrame]);

  const getCoffeeTextClass = () => {
    const lvl = STAGES[currentFrame].level;
    if (lvl === 2) return "text-5xl sm:text-7xl md:text-9xl font-black";
    if (lvl === 1) return "text-3xl sm:text-5xl md:text-7xl font-bold";
    return "text-xl sm:text-2xl md:text-3xl font-bold text-stone-300";
  };

  const getTeaTextClass = () => {
    const lvl = STAGES[currentFrame].level;
    if (lvl === -2) return "text-5xl sm:text-7xl md:text-9xl font-black";
    if (lvl === -1) return "text-3xl sm:text-5xl md:text-7xl font-bold";
    return "text-xl sm:text-2xl md:text-3xl font-bold text-stone-300";
  };

  return (
    <section className="relative w-full py-24 bg-[#fcfaf7] dark:bg-zinc-950 overflow-hidden border-b-2 border-stone-200 transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* HEADLINE SECTION */}
        <div className="text-center mb-16 max-w-6xl z-20">
          <h2 className={`text-[#8A3D04] dark:text-[#e7d9c1] text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase mb-10 whitespace-pre-line drop-shadow-sm
            ${isIndic ? 'leading-[1.2] md:leading-[1.1]' : 'leading-[0.9] md:leading-[0.8]'}
          `}>
            {t.title}
          </h2>
          <div className="flex flex-col items-center gap-4">
            <p className="text-[#B28869] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
              {t.subtitle}
            </p>
            
            {/* UPDATED REASON SECTION WITH INLINE LINK */}
            <div className="max-w-xl">
               <p className="text-[12px] md:text-sm font-medium text-stone-500 italic leading-relaxed inline">
                {t.reason}{" "}
              </p>
              <Link 
                href="/order/coffee-vs-tea" 
                className="inline-flex items-center gap-1 text-[#8A3D04] dark:text-amber-500 font-bold text-[11px] md:text-xs uppercase tracking-wider hover:underline decoration-2 underline-offset-4 transition-all"
              >
                <span>{t.readMore}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* TEAM HEADERS */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-8 h-32 md:h-48 z-20 px-4">
            <div className="flex flex-col items-start transition-all duration-500">
                <span className={`uppercase tracking-tighter text-[#8A3D04] leading-tight py-2 ${getCoffeeTextClass()}`}>
                    {t.coffeeTeam}
                </span>
            </div>
            <div className="flex flex-col items-end transition-all duration-500">
                <span className={`uppercase tracking-tighter text-green-800 leading-tight py-2 ${getTeaTextClass()}`}>
                    {t.teaTeam}
                </span>
            </div>
        </div>

        {/* 3D ARENA */}
        <motion.div 
          animate={holoImpact}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="relative w-full max-w-2xl z-10"
        >
          <div className="relative aspect-21/9 w-full overflow-hidden rounded-t-3xl bg-white border-t border-x border-stone-200 shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentFrame}
                initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image src={STAGES[currentFrame].path} alt="Arena" fill className="object-cover" priority />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full h-4 flex overflow-hidden rounded-b-3xl shadow-xl border-x border-b border-stone-200">
              <motion.div 
                  animate={{ width: `${coffeeWeight}%` }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="h-full bg-[#8A3D04] flex items-center pl-4 md:pl-6 border-r-2 border-white/20"
              >
                  {coffeeWeight > 15 && <span className="text-[10px] font-black text-white/60">{coffeeWeight}%</span>}
              </motion.div>
              <motion.div 
                  animate={{ width: `${100 - coffeeWeight}%` }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="h-full bg-green-800 flex items-center justify-end pr-4 md:pr-6"
              >
                  {100 - coffeeWeight > 15 && <span className="text-[10px] font-black text-white/60">{100 - coffeeWeight}%</span>}
              </motion.div>
          </div>
        </motion.div>

        {/* PRIMARY CALL TO ACTION */}
        <div className="mt-20 flex flex-col items-center z-20">
            <Link href="/menu" className="group">
                <button className="relative px-12 py-6 md:px-16 md:py-8  bg-stone-800 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-6 overflow-hidden">
                   <Swords size={20} className="group-hover:rotate-12 transition-transform duration-300 shrink-0" />
                   <span className="relative z-10">{t.ctaBattle}</span>
                   <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
            </Link>
            
            <div className="mt-12 flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">{t.supportText}</span>
            </div>
        </div>

      </div>
    </section>
  );
}