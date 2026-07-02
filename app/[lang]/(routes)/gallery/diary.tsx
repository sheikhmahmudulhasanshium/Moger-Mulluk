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
  <div className="absolute inset-0 overflow-hidden rounded-r-2xl bg-[#fdfcf0] border border-black/10 shadow-sm">
    <div className="flex flex-col md:flex-row h-full">
      <div className="relative w-full h-1/2 md:w-3/5 md:h-full">
        <Image src={page.url} alt={page.title} fill priority className="object-cover" />
        <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-black/30 to-transparent" />
      </div>

      <div className="relative w-full h-1/2 md:w-2/5 md:h-full p-10 md:p-14 bg-[#fdfcf0] text-neutral-900 flex flex-col justify-center">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "4px 4px" }}
        />
        <span className="text-amber-700 font-serif italic text-lg mb-2">Entry {entryNumber}</span>
        <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">{page.title}</h2>
        <p className="text-lg italic font-serif text-neutral-600 leading-relaxed">&ldquo;{page.desc}&rdquo;</p>
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

  const flipNext = useCallback(() => {
    if (isFlipping || isResetting) return;

    // Trigger RESET if at the end
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
      if (e.key === "ArrowRight" || e.key === " ") flipNext();
      if (e.key === "ArrowLeft") flipBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipNext, flipBack]);

  return (
    <div className="min-h-screen bg-[#351c06c9] dark:bg-[#5322025d] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
          <Sparkles className="w-3 h-3" />
          The Kingdom Archive
        </div>
        <h1 className="text-4xl md:text-6xl font-serif italic text-neutral-100">Visual Diary</h1>
      </header>

      <div className="relative w-full max-w-275 aspect-video" style={{ perspective: "2500px" }}>
        {/* Hinge */}
        <div className="absolute inset-y-0 -left-2 w-6 bg-linear-to-r from-black via-neutral-800 to-black rounded-l-md shadow-2xl z-100" />

        {/* BACKGROUND PAGE (The landing page) */}
        {/* If resetting, background immediately shows page 0 */}
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
              style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
              initial={{ rotateY: direction === "next" ? 0 : -180 }}
              animate={{ rotateY: direction === "next" ? -180 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.65, 0.05, 0.36, 1] }}
              onAnimationComplete={() => setIsFlipping(false)}
            >
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                  <Page page={atmosphereImages[direction === "next" ? flipIndex : flipIndex + 1]} entryNumber={0} />
                </div>
                <div className="absolute inset-0 bg-[#f4f1e0] rounded-r-2xl" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                   <div className="flex h-full items-center justify-center opacity-10"><BookOpen className="w-32 h-32 text-black" /></div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESET "FLIP ALL BACK" ANIMATION */}
        {isResetting &&
          [...Array(atmosphereImages.length)].map((_, i) => {
            // We flip from last page back to first
            const reverseIndex = (atmosphereImages.length - 1) - i;
            return (
              <motion.div
                key={`reset-${reverseIndex}`}
                className="absolute inset-0 z-60"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                  zIndex: 60 + i // Higher pages flip on top
                }}
                initial={{ rotateY: -180 }}
                animate={{ rotateY: 0 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1, // Staggered delay for "riffle" effect
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
                   <div className="w-full h-full bg-[#f4f1e0] rounded-r-2xl flex items-center justify-center">
                     <BookOpen className="w-32 h-32 opacity-10 text-black" />
                   </div>
                </div>
                <div className="absolute inset-0" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                  <Page page={atmosphereImages[reverseIndex]} entryNumber={reverseIndex + 1} />
                </div>
              </motion.div>
            );
          })}

        {/* Hot Zones */}
        <div className="absolute left-0 top-0 h-full w-32 z-150 cursor-w-resize" onClick={flipBack} />
        <div className="absolute right-0 top-0 h-full w-32 z-150 cursor-e-resize" onClick={flipNext} />
      </div>

      {/* Navigation UI */}
      <div className="mt-16 flex flex-col items-center gap-8">
        <div className="flex items-center gap-12">
          <button onClick={flipBack} disabled={page === 0 || isFlipping || isResetting} className="group flex flex-col items-center gap-2 disabled:opacity-20">
            <div className="p-5 rounded-full border border-white/10 group-hover:bg-amber-600 transition">
              <ChevronLeft className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">History</span>
          </button>

          <div className="text-2xl font-serif italic text-amber-500 min-w-22.5 text-center">
             {isResetting ? "..." : `${page + 1} / ${atmosphereImages.length}`}
          </div>

          <button onClick={flipNext} disabled={isFlipping || isResetting} className="group flex flex-col items-center gap-2 disabled:opacity-20">
            <div className="p-5 rounded-full border border-white/10 group-hover:bg-amber-600 transition">
              <ChevronRight className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                {page === atmosphereImages.length - 1 ? "Reset" : "Next Entry"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}