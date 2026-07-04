"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

// --- Types ---
export interface DiaryPage {
  url: string;
  title: string;
  desc: string;
}

export type FlipDirection = "next" | "prev";

// --- Components ---

const Page = ({ page, entryNumber }: { page: DiaryPage; entryNumber: number }) => (
  <div className="absolute inset-0 overflow-hidden rounded-b-2xl md:rounded-l-none md:rounded-r-2xl bg-[#fdfcf0] border border-black/10 shadow-sm">
    <div className="flex flex-col md:flex-row h-full">
      <div className="relative w-full h-1/2 md:w-3/5 md:h-full">
        <Image src={page.url} alt={page.title} fill priority className="object-cover" />
        {/* Shadow gradient for the hinge */}
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/30 to-transparent md:inset-y-0 md:left-0 md:w-16 md:h-full md:bg-linear-to-r" />
      </div>

      <div className="relative w-full h-1/2 md:w-2/5 md:h-full p-8 md:p-14 bg-[#fdfcf0] text-neutral-900 flex flex-col justify-center">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "4px 4px" }}
        />
        <span className="text-amber-700 font-serif italic text-sm md:text-lg mb-1 md:mb-2">Entry {entryNumber}</span>
        <h2 className="text-2xl md:text-5xl font-serif mb-3 md:mb-6 leading-tight">{page.title}</h2>
        <p className="text-base md:text-lg italic font-serif text-neutral-600 leading-relaxed">&ldquo;{page.desc}&rdquo;</p>
      </div>
    </div>
  </div>
);

// --- Main Gallery ---

const atmosphereImages: DiaryPage[] = [
  { url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&h=800&auto=format&fit=crop", title: "The Grand Sanctuary", desc: "Our journey began here, under the golden glow of the realm's first lanterns." },
  { url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&h=800&auto=format&fit=crop", title: "Luminous Shadows", desc: "The dance of evening light through our signature tall windows." },
  { url: "https://images.unsplash.com/photo-1656850713613-e4b663338bff?q=80&w=1200&h=800&auto=format&fit=crop", title: "Quiet Sanctuary", desc: "A place where the city's noise fades into a whisper of steaming tea." },
  { url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&h=800&auto=format&fit=crop", title: "The Creative Hub", desc: "Where the aroma of coffee fuels the next big idea." },
  { url: "https://images.unsplash.com/photo-1722962883780-8806c3ab546b?q=80&w=1200&h=800&auto=format&fit=crop", title: "Bean to Brew", desc: "Tracing the path of every bean from artisanal farms to your royal cup." },
  { url: "https://images.unsplash.com/photo-1491497895121-1334fc14d8c9?q=80&w=1200&h=800&auto=format&fit=crop", title: "Velvet Pour", desc: "The silk-like pour that defines our artisanal signature." },
  { url: "https://images.unsplash.com/photo-1584031745084-223095abdb0c?q=80&w=1200&h=800&auto=format&fit=crop", title: "Kingdom Service", desc: "Hospitality is the silent language of our monarchy." },
  { url: "https://images.unsplash.com/photo-1603912699214-92627f304eb6?q=80&w=1200&h=800&auto=format&fit=crop", title: "The Aura to Go", desc: "Take a piece of the realm with you, wherever you wander." },
  { url: "https://images.unsplash.com/photo-1692796333852-c65c3adc817a?q=80&w=1200&h=800&auto=format&fit=crop", title: "Seal of Excellence", desc: "Our legacy, preserved and sealed in every signature package." },
];

export default function Diary() {
  const [page, setPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [direction, setDirection] = useState<FlipDirection>("next");
  const [flipIndex, setFlipIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle Resize for Responsive Animation Logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const flipNext = useCallback(() => {
    if (isFlipping || isResetting) return;
    if (page === atmosphereImages.length - 1) {
      setIsResetting(true);
      return;
    }
    setDirection("next");
    setFlipIndex(page);
    setIsFlipping(true);
    setPage((p) => p + 1);
  }, [page, isFlipping, isResetting]);

  const flipBack = useCallback(() => {
    if (isFlipping || isResetting || page <= 0) return;
    setDirection("prev");
    setFlipIndex(page - 1);
    setIsFlipping(true);
    setPage((p) => p - 1);
  }, [page, isFlipping, isResetting]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") flipNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") flipBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipNext, flipBack]);

  // Motion Variants configuration
  const getRotation = (isNext: boolean) => {
    if (isMobile) return { rotateX: isNext ? 180 : 0 };
    return { rotateY: isNext ? -180 : 0 };
  };

  const getInitialRotation = (isNext: boolean) => {
    if (isMobile) return { rotateX: isNext ? 0 : 180 };
    return { rotateY: isNext ? 0 : -180 };
  };

  return (
    <div className="min-h-screen bg-[#351c06c9] dark:bg-[#5322025d] text-white flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
      <header className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
          <Sparkles className="w-3 h-3" />
          The Kingdom Archive
        </div>
        <h1 className="text-4xl md:text-6xl font-serif italic text-neutral-100">Visual Diary</h1>
      </header>

      <div 
        className="relative w-full max-w-sm md:max-w-275 aspect-3/4 md:aspect-video" 
        style={{ perspective: "2500px" }}
      >
        {/* Hinge: Top on Mobile, Left on MD+ */}
        <div className="absolute z-100 
          inset-x-0 -top-2 h-6 bg-linear-to-b from-black via-neutral-800 to-black rounded-t-md shadow-2xl
          md:inset-y-0 md:-left-2 md:w-6 md:h-full md:bg-linear-to-r md:rounded-l-md md:rounded-t-none" 
        />

        {/* BACKGROUND PAGE */}
        <Page 
           page={isResetting ? atmosphereImages[0] : atmosphereImages[page]} 
           entryNumber={isResetting ? 1 : page + 1} 
        />

        {/* NORMAL FLIP ANIMATION */}
        <AnimatePresence>
          {isFlipping && !isResetting && flipIndex !== null && (
            <motion.div
              key={`flip-${flipIndex}`}
              className="absolute inset-0 z-50"
              style={{ 
                transformStyle: "preserve-3d", 
                transformOrigin: isMobile ? "center top" : "left center" 
              }}
              initial={getInitialRotation(direction === "next")}
              animate={getRotation(direction === "next")}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.65, 0.05, 0.36, 1] }}
              onAnimationComplete={() => setIsFlipping(false)}
            >
                {/* Front of flipping page */}
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                  <Page page={atmosphereImages[direction === "next" ? flipIndex : flipIndex + 1]} entryNumber={0} />
                </div>
                {/* Back of flipping page (Paper texture) */}
                <div 
                  className="absolute inset-0 bg-[#f4f1e0] rounded-b-2xl md:rounded-r-2xl md:rounded-b-none" 
                  style={{ 
                    transform: isMobile ? "rotateX(180deg)" : "rotateY(180deg)", 
                    backfaceVisibility: "hidden" 
                  }}
                >
                   <div className="flex h-full items-center justify-center opacity-10">
                     <BookOpen className="w-32 h-32 text-black" />
                   </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESET ANIMATION */}
        {isResetting &&
          [...Array(atmosphereImages.length)].map((_, i) => {
            const reverseIndex = (atmosphereImages.length - 1) - i;
            return (
              <motion.div
                key={`reset-${reverseIndex}`}
                className="absolute inset-0 z-60"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: isMobile ? "center top" : "left center",
                  zIndex: 60 + i
                }}
                initial={isMobile ? { rotateX: 180 } : { rotateY: -180 }}
                animate={isMobile ? { rotateX: 0 } : { rotateY: 0 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.65, 0.05, 0.36, 1],
                }}
                onAnimationComplete={() => {
                  if (i === atmosphereImages.length - 1) {
                    setPage(0);
                    setIsResetting(false);
                  }
                }}
              >
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                   <div className="w-full h-full bg-[#f4f1e0] rounded-b-2xl md:rounded-r-2xl md:rounded-b-none flex items-center justify-center">
                     <BookOpen className="w-32 h-32 opacity-10 text-black" />
                   </div>
                </div>
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    transform: isMobile ? "rotateX(180deg)" : "rotateY(180deg)", 
                    backfaceVisibility: "hidden" 
                  }}
                >
                  <Page page={atmosphereImages[reverseIndex]} entryNumber={reverseIndex + 1} />
                </div>
              </motion.div>
            );
          })}

        {/* Hot Zones: Vertical split for mobile, Horizontal for Desktop */}
        <div className="absolute left-0 top-0 h-1/2 w-full md:h-full md:w-32 z-150 cursor-pointer" onClick={flipBack} />
        <div className="absolute left-0 bottom-0 h-1/2 w-full md:h-full md:w-32 md:left-auto md:right-0 z-150 cursor-pointer" onClick={flipNext} />
      </div>

      {/* Navigation UI */}
      <div className="mt-8 md:mt-16 flex flex-col items-center gap-8">
        <div className="flex items-center gap-8 md:gap-12">
          <button onClick={flipBack} disabled={page === 0 || isFlipping || isResetting} className="group flex flex-col items-center gap-2 disabled:opacity-20 transition-all">
            <div className="p-4 md:p-5 rounded-full border border-white/10 group-hover:bg-amber-600 transition">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">History</span>
          </button>

          <div className="text-xl md:text-2xl font-serif italic text-amber-500 min-w-20 md:min-w-24 text-center">
             {isResetting ? "..." : `${page + 1} / ${atmosphereImages.length}`}
          </div>

          <button onClick={flipNext} disabled={isFlipping || isResetting} className="group flex flex-col items-center gap-2 disabled:opacity-20 transition-all">
            <div className="p-4 md:p-5 rounded-full border border-white/10 group-hover:bg-amber-600 transition">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                {page === atmosphereImages.length - 1 ? "Reset" : "Next"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}