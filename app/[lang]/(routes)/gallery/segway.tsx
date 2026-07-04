"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Coffee,
  CupSoda,
  Sandwich,
  Cake,
} from "lucide-react";

interface ProductGallery {
  _id: string;
  thumbnails: string[];
  count: number;
}

interface PageMeta {
  title: string;
  description: string;
  viewMore: string;
}

const translations = {
  en: {
    beverage: "Beverages",
    coffee: "Coffee",
    desert: "Desserts",
    snacks: "Snacks",
    tea: "Tea",
    subtitle: "The Kingdom Archive",
    quote: "Every brew belongs to a chapter, every dessert to a memory.",
  },
  bn: {
    beverage: "পানীয়",
    coffee: "কফি",
    desert: "মিষ্টান্ন",
    snacks: "নাস্তা",
    tea: "চা",
    subtitle: "মগের মুল্লুক আর্কাইভ",
    quote: "প্রতিটি পানীয় এক একটি অধ্যায়, প্রতিটি মিষ্টান্ন এক একটি স্মৃতি।",
  },
  hi: {
    beverage: "पेय",
    coffee: "कॉफ़ी",
    desert: "मिठाई",
    snacks: "नाश्ता",
    tea: "चाय",
    subtitle: "राज्य संग्रह",
    quote: "हर पेय एक अध्याय है, हर मिठाई एक स्मृति।",
  },
  es: {
    beverage: "Bebidas",
    coffee: "Café",
    desert: "Postres",
    snacks: "Aperitivos",
    tea: "Té",
    subtitle: "Archivo del Reino",
    quote: "Cada bebida pertenece a un capítulo, cada postre a un recuerdo.",
  },
};

const categoryIcons = {
  coffee: Coffee,
  tea: CupSoda,
  beverage: CupSoda,
  snacks: Sandwich,
  desert: Cake,
};

export default function Segway() {
  const params = useParams();
  const lang = (params?.lang as keyof typeof translations) || "en";
  const t = translations[lang];

  const [categories, setCategories] = useState<ProductGallery[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, metaRes] = await Promise.all([
          fetch("https://moger-mulluk-backend.vercel.app/api/products/gallery"),
          fetch(`https://moger-mulluk-backend.vercel.app/api/pages/key/${lang}/gallery`),
        ]);
        const products = await prodRes.json();
        const page = await metaRes.json();
        setCategories(products);
        setMeta(page);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang]);

  if (loading || !meta) return null;

  return (
    <section className="relative w-full py-16 md:py-24 overflow-x-clip bg-[#fffcf2] dark:bg-[#0a0908]">
      
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d4a373 0.8px, transparent 0.8px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle Glows */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-amber-200/20 dark:from-amber-900/10 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Divider */}
        <div className="flex justify-center items-center gap-4 md:gap-6 mb-12 md:mb-16">
          <div className="h-px w-12 md:w-20 bg-amber-900/20 dark:bg-amber-500/20" />
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
          <div className="h-px w-12 md:w-20 bg-amber-900/20 dark:bg-amber-500/20" />
        </div>

        {/* Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="block text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-amber-700 dark:text-amber-500 font-bold mb-4">
            {t.subtitle}
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-zinc-900 dark:text-zinc-100 wrap-break-word leading-tight">
            {meta.title.split("|")[0]}
          </h2>

          <p className="mt-6 md:mt-8 text-zinc-700 dark:text-zinc-400 leading-relaxed text-base md:text-xl max-w-2xl mx-auto px-2">
            {meta.description}
          </p>

          <p className="mt-6 italic font-serif text-amber-800 dark:text-amber-400/80 text-base md:text-lg">
            “{t.quote}”
          </p>
        </div>

        {/* Archive Shelves */}
        <div className="grid gap-6 md:gap-8">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat._id as keyof typeof categoryIcons] || Coffee;

            return (
              <Link key={cat._id} href={`/${lang}/menu`} className="group block">
                <div className="relative rounded-3xl md:rounded-4xl p-5 md:p-8 transition-all duration-700
                  bg-white/80 border border-amber-900/5 shadow-sm
                  dark:bg-zinc-900/40 dark:border-white/5
                  hover:shadow-xl hover:shadow-amber-900/10 dark:hover:shadow-none
                  hover:bg-white dark:hover:bg-amber-950/20 
                  hover:-translate-y-1 overflow-hidden">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4">
                    
                    {/* Category Identity (Col 1-4) */}
                    <div className="lg:col-span-4 flex items-center gap-4 md:gap-6">
                      <div className="flex h-12 w-12 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-xl md:rounded-2xl 
                        bg-amber-100 dark:bg-amber-500/10 
                        text-amber-700 dark:text-amber-400 
                        border border-amber-200 dark:border-amber-500/20">
                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-serif italic text-2xl md:text-3xl text-zinc-900 dark:text-white truncate">
                          {t[cat._id as keyof typeof t] || cat._id}
                        </h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-500 font-bold mt-1">
                          Collection
                        </p>
                      </div>
                    </div>

                    {/* Image Thumbnails (Col 5-9) */}
                    <div className="lg:col-span-5 flex flex-wrap lg:flex-nowrap justify-start items-center -space-x-3 md:space-x-3 overflow-visible">
                      {cat.thumbnails.slice(0, 4).map((img, i) => (
                        <div
                          key={i}
                          className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-xl md:rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 p-1.5 shadow-sm transition-all duration-500 group-hover:-translate-y-2"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          <div className="relative w-full h-full">
                             <Image src={img} alt="" fill className="object-contain" sizes="80px" />
                          </div>
                        </div>
                      ))}
                      {cat.thumbnails.length > 4 && (
                        <div className="h-10 w-10 flex items-center justify-center text-zinc-400 text-xs font-bold pl-4">
                          +{cat.thumbnails.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Stats & Nav (Col 10-12) */}
                    <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6 md:gap-10 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800 pt-6 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <div className="text-4xl md:text-5xl font-serif text-amber-600 dark:text-amber-500">
                          {cat.count}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                          Items
                        </div>
                      </div>

                      <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:text-white transition-all duration-500">
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-16 md:mt-24 flex justify-center">
          <Link href={`/${lang}/menu`} className="group flex flex-col items-center gap-4 text-center">
            <span className="uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs font-bold text-amber-800 dark:text-amber-500">
              {meta.viewMore || "View Full Archive"}
            </span>
            <div className="flex items-center gap-2">
               <div className="h-0.5 w-8 md:w-12 bg-amber-600 dark:bg-amber-500 transition-all duration-500 group-hover:w-20 md:group-hover:w-24" />
               <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-500 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}