"use client";

import { useLocale } from "next-intl";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

// --- TYPES ---

interface CertItem {
  id: string;
  name: string;
  fact: string;
  icon: React.ComponentType; // Strictly types the SVG component
}

interface TranslationData {
  title: string;
  items: CertItem[];
}

// --- BOLD, HIGH-CONTRAST SVGS ---

const FoodSafetySVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-16">
    <path d="M50 8 L18 22 V50 C18 72 50 92 50 92 C50 92 82 72 82 50 V22 L50 8Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M38 52 L46 60 L62 42" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HalalSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-16">
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3"/>
    <text x="50" y="48" fontFamily="serif" fontSize="18" fill="currentColor" textAnchor="middle" fontWeight="bold">حلال</text>
    <text x="50" y="70" fontFamily="sans-serif" fontSize="10" fill="currentColor" textAnchor="middle" fontWeight="900" letterSpacing="1">HALAL</text>
  </svg>
);

const NetZeroSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-16">
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3"/>
    <path d="M30 65 Q50 15 70 65" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M40 75 L50 65 L60 75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EcoPackagingSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-16">
    <path d="M50 85 C50 85 85 55 85 30 C85 15 65 15 50 30 C35 15 15 15 15 30 C15 55 50 85 50 85 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 85V40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const translations: Record<string, TranslationData> = {
  en: {
    title: "Global \n Accreditation",
    items: [
      { id: "safety", name: "Safety Standards", fact: "Certified by FDA (US), FSSAI (IND), and BSTI (BD) for rigorous food safety and hygiene protocols.", icon: FoodSafetySVG },
      { id: "halal", name: "Halal Quality", fact: "100% Halal certified ingredients sourced globally, catering to our regional markets in Bangladesh and beyond.", icon: HalalSVG },
      { id: "carbon", name: "Carbon Neutral", fact: "We maintain a net-zero supply chain for our US and Spain operations, offsetting every kilogram of CO2.", icon: NetZeroSVG },
      { id: "packaging", name: "Zero Waste", fact: "Exclusively using 100% biodegradable and recycled packaging across all international cafe locations.", icon: EcoPackagingSVG },
    ]
  },
  bn: {
    title: "বৈশ্বিক \n স্বীকৃতি",
    items: [
      { id: "safety", name: "নিরাপত্তা মান", fact: "কঠোর খাদ্য নিরাপত্তা এবং স্বাস্থ্যবিধি প্রোটোকলের জন্য FDA (US), FSSAI (IND), এবং BSTI (BD) দ্বারা প্রত্যয়িত।", icon: FoodSafetySVG },
      { id: "halal", name: "হালাল গুণমান", fact: "বিশ্বব্যাপী সংগৃহীত ১০০% হালাল প্রত্যয়িত উপাদান, যা বাংলাদেশ এবং আমাদের আঞ্চলিক বাজারের চাহিদা পূরণ করে।", icon: HalalSVG },
      { id: "carbon", name: "কার্বন নিউট্রাল", fact: "আমরা ইউএস এবং স্পেন অপারেশনের জন্য একটি নেট-জিরো সাপ্লাই চেইন বজায় রাখি, যা প্রতি কেজি CO2 অফসেট করে।", icon: NetZeroSVG },
      { id: "packaging", name: "জিরো ওয়েস্ট", fact: "সমস্ত আন্তর্জাতিক ক্যাফে লোকেশনে একচেটিয়াভাবে ১০০% বায়োডিগ্রেডেবল এবং রিসাইকেলড প্যাকেজিং ব্যবহার করা হয়।", icon: EcoPackagingSVG },
    ]
  },
  hi: {
    title: "वैश्विक \n मान्यता",
    items: [
      { id: "safety", name: "सुरक्षा मानक", fact: "कठोर खाद्य सुरक्षा और स्वच्छता प्रोटोकॉल के लिए FDA (US), FSSAI (IND), और BSTI (BD) द्वारा प्रमाणित।", icon: FoodSafetySVG },
      { id: "halal", name: "हलाल गुणवत्ता", fact: "विश्व स्तर पर प्राप्त 100% हलाल प्रमाणित सामग्री, जो बांग्लादेश और हमारे क्षेत्रीय बाजारों की जरूरतों को पूरा करती है।", icon: HalalSVG },
      { id: "carbon", name: "कार्बन न्यूट्रल", fact: "हम अपने अमेरिकी और स्पेन के संचालन के लिए नेट-जीरो सप्लाई चेन बनाए रखते हैं, जो हर किलो CO2 की भरपाई करती है।", icon: NetZeroSVG },
      { id: "packaging", name: "जीरो वेस्ट", fact: "सभी अंतरराष्ट्रीय कैफे स्थानों पर विशेष रूप से 100% बायोडिग्रेडेबल और पुनर्नवीनीकरण पैकेजिंग का उपयोग किया जाता है।", icon: EcoPackagingSVG },
    ]
  },
  es: {
    title: "Acreditación \n Global",
    items: [
      { id: "safety", name: "Seguridad", fact: "Certificado por FDA (EE. UU.), FSSAI (IND) y BSTI (BD) bajo rigurosos protocolos de higiene alimentaria.", icon: FoodSafetySVG },
      { id: "halal", name: "Calidad Halal", fact: "Ingredientes 100% certificados Halal de origen global, atendiendo a nuestros mercados en Bangladesh y más allá.", icon: HalalSVG },
      { id: "carbon", name: "Carbono Neutro", fact: "Mantenemos una cadena de suministro neta cero para EE. UU. y España, compensando cada kilogramo de CO2.", icon: NetZeroSVG },
      { id: "packaging", name: "Residuo Cero", fact: "Uso exclusivo de envases 100% biodegradables y reciclados en todas nuestras ubicaciones internacionales.", icon: EcoPackagingSVG },
    ]
  }
};

interface FlipCardProps {
  cert: CertItem;
  isSouthAsian: boolean;
}

function FlipCard({ cert, isSouthAsian }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = cert.icon; // Accessing component properly

  return (
    <div 
      className="group h-112.5 perspective-distant cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-800 transform-3d group-hover:transform-[rotateY(180deg)]",
          isFlipped && "transform-[rotateY(180deg)]"
        )}
      >
        {/* FRONT */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-10 bg-white dark:bg-zinc-900 border-2 border-stone-200 dark:border-zinc-800 backface-hidden">
          <div className="w-full h-full flex items-center justify-center text-[#512604] dark:text-amber-500">
            <Icon />
          </div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#512604] dark:text-stone-300 border-t-2 border-stone-100 dark:border-zinc-800 pt-6 w-full text-center">
            {cert.name}
          </h4>
        </div>

        {/* BACK */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-[#512604] text-white backface-hidden shadow-2xl transform-[rotateY(180deg)]"
        >
          <div className="mb-8 p-3 bg-white/10 rounded-full">
             <Icon />
          </div>
          <p className={cn(
            "text-center font-bold uppercase tracking-wide",
            isSouthAsian ? 'leading-[1.8] text-[15px]' : 'leading-relaxed text-[12px]'
          )}>
            {cert.fact}
          </p>
          <div className="mt-10 h-1 w-12 bg-amber-500"></div>
        </div>
      </div>
    </div>
  );
}

export default function TheStandard() {
  const locale = useLocale();
  const t = translations[locale] || translations.en;
  const isSouthAsian = locale === 'bn' || locale === 'hi';

  return (
    <section className="w-full bg-[#fcfaf7] dark:bg-zinc-950 py-32 overflow-hidden border-b border-stone-200 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <h2 className={cn(
            "text-[#512604] dark:text-[#e7d9c1] text-6xl md:text-8xl font-black tracking-tighter uppercase whitespace-pre-line",
            isSouthAsian ? 'leading-[1.3]' : 'leading-[0.9]'
          )}>
            {t.title}
          </h2>
          <div className="mt-8 h-2 w-32 bg-[#8A3D04]"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {t.items.map((cert) => (
            <FlipCard key={cert.id} cert={cert} isSouthAsian={isSouthAsian} />
          ))}
        </div>
      </div>
    </section>
  );
}