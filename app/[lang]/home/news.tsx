"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { ChevronRight, Newspaper } from "lucide-react";
import { Link } from "@/i18n/routing";

const translations = {
  en: {
    title: "The \n Dispatch",
    subtitle: "Directives from the Realm",
    archiveCta: "View Archive",
    notices: [
      "NOTICE: Madrid Branch reaching 100k cups served.",
      "UPDATE: New Batch of 'Espresso Noir' Ethiopia beans arriving Tuesday.",
      "ALERT: Weekend Brunch timings extended until 4:00 PM.",
      "DIRECTIVE: Eco-friendly mugs now mandatory across all branches."
    ]
  },
  bn: {
    title: "দ্য \n ডিসপ্যাচ",
    subtitle: "সাম্রাজ্য থেকে সরাসরি বার্তা",
    archiveCta: "আর্কাইভ দেখুন",
    notices: [
      "নোটিশ: মাদ্রিদ শাখা ১ লক্ষ কাপ কফি পরিবেশন করেছে।",
      "আপডেট: মঙ্গলবার ইথিওপিয়া থেকে 'এসপ্রেসো নোয়ার' মটরশুঁটির নতুন ব্যাচ আসছে।",
      "অ্যালার্ট: উইকএন্ড ব্রাঞ্চের সময় বিকেল ৪টা পর্যন্ত বাড়ানো হয়েছে।",
      "নির্দেশনা: এখন থেকে সমস্ত শাখায় পরিবেশবান্ধব মগ বাধ্যতামূলক।"
    ]
  },
  hi: {
    title: "द \n डिस्पैच",
    subtitle: "साम्राज्य से सीधे निर्देश",
    archiveCta: "पुरालेख देखें",
    notices: [
      "नोटिस: मैड्रिड शाखा 1 लाख कप कॉफी परोसने के मील के पत्थर पर पहुंची।",
      "अपडेट: मंगलवार को इथियोपिया से 'एस्प्रेसो नोयर' बीन्स का नया बैच आ रहा है।",
      "अलर्ट: वीकेंड ब्रंच का समय शाम 4:00 बजे तक बढ़ा दिया गया है।",
      "निर्देश: अब सभी शाखाओं में पर्यावरण के अनुकूल मग अनिवार्य हैं।"
    ]
  },
  es: {
    title: "El \n Despacho",
    subtitle: "Directivas desde el Reino",
    archiveCta: "Ver Archivo",
    notices: [
      "AVISO: La sucursal de Madrid alcanza las 100.000 tazas servidas.",
      "ACTUALIZACIÓN: Nuevo lote de granos 'Espresso Noir' llega el martes.",
      "ALERTA: Horario de brunch de fin de semana extendido hasta las 4:00 PM.",
      "DIRECTIVA: Tazas ecológicas obligatorias en todas las sucursales."
    ]
  }
};

export default function TheDispatch() {
  const locale = useLocale() as keyof typeof translations;
  const t = translations[locale] || translations.en;

  return (
    <section className="relative w-full bg-[#fcfaf7] dark:bg-zinc-950 py-32 overflow-hidden border-b border-stone-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="flex items-center gap-3 text-[#8A3D04] mb-6">
             <Newspaper size={24} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.subtitle}</span>
          </div>
          <h2 className="text-[#8A3D04] dark:text-[#e7d9c1] text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase whitespace-pre-line">
            {t.title}
          </h2>
        </div>

        {/* NOTICES LIST */}
        <div className="flex flex-col gap-0 border-y border-stone-200 dark:border-zinc-800">
          {t.notices.map((notice, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex gap-6 py-10 px-4 hover:bg-white dark:hover:bg-zinc-900 transition-colors border-b border-stone-200 dark:border-zinc-800 last:border-0"
            >
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] font-black text-[#B28869] leading-none mb-1">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <div className="w-px h-full bg-stone-200 dark:bg-zinc-800 group-hover:bg-[#8A3D04] transition-colors" />
              </div>
              
              <div className="flex flex-col grow gap-2">
                <p className="text-sm md:text-lg font-medium text-stone-600 dark:text-stone-300 leading-relaxed uppercase tracking-tight">
                  {notice}
                </p>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="h-px w-8 bg-[#8A3D04]" />
                   <span className="text-[8px] font-black text-[#8A3D04] uppercase tracking-widest italic">Received — Active</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
           <Link href="/notice" className="group flex items-center gap-2 text-[#B28869] hover:text-[#8A3D04] transition-colors">
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">{t.archiveCta}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

      </div>
    </section>
  );
}