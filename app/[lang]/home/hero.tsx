"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { localesConfig, routing } from "@/i18n/routing";
import { GalleryCategory, productApi } from "@/app/components/hooks/product-api";

interface ImageNode {
  url: string;
  id: string;
}

export default function CinematicHero() {
  const [rows, setRows] = useState<ImageNode[][]>([[], [], [], []]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarqueeInView, setIsMarqueeInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const tLogo = useTranslations("Logo");
  const tFooter = useTranslations("Footer");

  const brandName = tLogo("brandName");
  const tagline = tFooter("tagline");

  const currentLocale = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;

  const countryCode = localesConfig[currentLocale as keyof typeof localesConfig]?.country || "BD";

  const getFontClass = () => {
    switch (locale) {
      case "bn": return 'font-["Noto_Sans_Bengali"]';
      case "hi": return 'font-["Noto_Sans_Devanagari"]';
      default: return "font-sans";
    }
  };

  // 1. Intersection Observer to enable lazy loading on view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMarqueeInView(true);
          observer.disconnect(); // Stop observing once loaded
        }
      },
      { rootMargin: "150px" } // Pre-load 150px before entering viewport
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Defer API call until the component enters the viewport
  useEffect(() => {
    if (!isMarqueeInView) return;

    const loadGallery = async () => {
      try {
        const data: GalleryCategory[] = await productApi.getGallery();
        const allImages = data.flatMap((cat) =>
          cat.thumbnails.map((url, i) => ({ url, id: `${cat._id}-${i}` }))
        );
        const distributedRows: ImageNode[][] = [[], [], [], []];
        allImages.forEach((img, index) => { distributedRows[index % 4].push(img); });
        setRows(distributedRows);
      } catch (err) {
        console.error("Hero Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGallery();
  }, [isMarqueeInView]);

  return (
    <section 
      ref={sectionRef}
      className="relative flex h-150 w-full flex-col justify-center overflow-hidden bg-[#fcfaf7] transition-colors duration-500 dark:bg-zinc-950 md:h-212.5"
    >
      
      {/* 1. SEAMLESS PRODUCT WALL (Now rendered lazily) */}
      <div className="flex flex-col opacity-80 transition-opacity dark:opacity-40">
        {!isLoading && isMarqueeInView && rows.map((rowItems, idx) => (
          rowItems.length > 0 && (
            <MarqueeRow 
              key={idx}
              items={rowItems} 
              direction={idx % 2 === 0 ? "left" : "right"} 
              speed={130 + (idx * 20)} 
            />
          )
        ))}
      </div>

      {/* 2. BRAND OVERLAY - COMPACT YOUTUBE STYLE */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(252,250,247,1)_0%,rgba(252,250,247,0.4)_50%,transparent_85%)] dark:bg-[radial-gradient(circle,rgba(9,9,11,1)_0%,rgba(9,9,11,0.4)_50%,transparent_85%)]" />

        <div className="pointer-events-auto relative flex items-center gap-x-4 md:gap-x-8">
          
          {/* LEFT: ICON (4x4 Units) */}
          <div className="relative h-28 w-28 shrink-0 sm:h-40 sm:w-40 md:h-64 md:w-64 lg:h-80 lg:w-80">
            <Image
              src="/favicon/web-app-manifest-512x512.png" // Using the optimized manifest image source
              alt="Logo Icon"
              fill
              className="object-contain dark:brightness-110"
              priority
              // Fixed: Custom sizes constrain downloads to exact display dimensions, avoiding 512px over-fetching
              sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, (max-width: 1024px) 256px, 320px"
            />
          </div>

          {/* RIGHT: COMPACT TEXT STACK */}
          <div className="flex h-28 w-fit flex-col justify-between sm:h-40 md:h-64 lg:h-80">
            
            {/* ROW 1: COUNTRY CODE (0.5 Units) - ALIGNED RIGHT */}
            <div className="flex h-[12.5%] w-full items-start justify-end">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#B28869] leading-none sm:text-sm md:text-3xl dark:text-[#d4a373]">
                {countryCode}
              </span>
            </div>

            {/* ROW 2: BRAND NAME (2.5 Units) - ALIGNED LEFT */}
            <div className="flex h-[62.5%] items-center justify-start">
              <h1 className={`
                ${getFontClass()}
                text-[#8A3D04] font-black leading-none tracking-tighter
                text-2xl sm:text-4xl md:text-8xl lg:text-9xl
                dark:text-[#e7d9c1]
              `}>
                {brandName}
              </h1>
            </div>

            {/* ROW 3: TAGLINE (1.0 Unit) - LARGER & BOLDER FOR SM/MD */}
            <div className="flex h-[25%] items-end justify-start">
              <h2 className={`
                ${getFontClass()}
                text-[#B28869] font-black leading-none
                text-[13px] sm:text-xl md:text-5xl lg:text-5xl
                dark:text-[#a98467]
              `}>
                {tagline}
              </h2>
            </div>

          </div>
        </div>
      </motion.div>

      {/* 3. EDGE VIGNETTES */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-linear-to-b from-[#fcfaf7] to-transparent dark:from-zinc-950 md:h-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-[#fcfaf7] to-transparent dark:from-zinc-950 md:h-60" />
    </section>
  );
}

function MarqueeRow({ items, direction, speed }: { items: ImageNode[], direction: "left" | "right", speed: number }) {
  const loopItems = Array(4).fill(items).flat();
  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        className="flex shrink-0"
        animate={{ x: direction === "left" ? [0, -2500] : [-2500, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {loopItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="relative h-28 w-28 shrink-0 md:h-48 md:w-48">
            <Image src={item.url} alt="product" fill className="object-cover" sizes="250px" />
          </div>
        ))}
      </motion.div>
      <motion.div
        className="flex shrink-0"
        animate={{ x: direction === "left" ? [0, -2500] : [-2500, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {loopItems.map((item, idx) => (
          <div key={`${item.id}-dup-${idx}`} className="relative h-28 w-28 shrink-0 md:h-48 md:w-48">
            <Image src={item.url} alt="product" fill className="object-cover" sizes="250px" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}