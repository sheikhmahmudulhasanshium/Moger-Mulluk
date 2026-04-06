"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { MapPin } from "lucide-react";
import { COORDS, translations } from "@/lib/locations";

export default function GlobalFootprint() {
  const [selectedId, setSelectedId] = useState<string>("bd");
  const locale = useLocale() as keyof typeof translations;
  
  // 1. Get the current language data
  const t = translations[locale] || translations.en;
  
  // 2. IMPORTANT: Always get the English data as the "Master" reference 
  // to ensure we never "reduce" the number of branches in other languages.
  const masterData = translations.en.locs[selectedId as keyof typeof translations.en.locs];
  
  // 3. Current active localized data
  const activeData = t.locs[selectedId as keyof typeof t.locs];
  const activeCoord = COORDS.find((c) => c.id === selectedId);

  // 4. Sidebar List (Excluding current selection)
  const otherLocations = useMemo(() => {
    return COORDS.filter((c) => c.id !== selectedId);
  }, [selectedId]);

  return (
    <section className="relative w-full bg-[#fcfaf7] dark:bg-zinc-950 py-24 md:py-32 overflow-hidden border-y border-stone-200 dark:border-zinc-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. HEADER */}
        <div className="mb-12">
          <h2 className="text-[#8A3D04] dark:text-[#e7d9c1] text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase whitespace-pre-line ">
            {t.title}
          </h2>
        </div>

        {/* 2. INTERACTIVE MAP */}
        <div className="relative w-full aspect-video md:aspect-21/8 rounded-3xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-900 shadow-2xl mb-12">
          <div className="absolute inset-0 grayscale invert dark:invert-0 brightness-[0.95] dark:brightness-[0.35] contrast-125 opacity-30">
            <Image src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" alt="Map" fill className="object-cover" priority />
          </div>

          {COORDS.map((coord) => {
            const isActive = selectedId === coord.id;
            const data = t.locs[coord.id as keyof typeof t.locs];
            return (
              <button
                key={coord.id}
                onClick={() => setSelectedId(coord.id)}
                // Proximity fix: Non-active pins get higher z-index so they are clickable near India/BD
                className={`absolute group outline-none transform -translate-x-1/2 -translate-y-1/2 p-4 ${isActive ? 'z-20' : 'z-30'}`}
                style={{ left: coord.x, top: coord.y }}
              >
                <div className={`relative h-3 w-3 md:h-4 md:w-4 rounded-full transition-all duration-500 ${isActive ? 'bg-amber-500 scale-125 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-[#8A3D04]'}`} />
                <div className={`absolute top-10 left-1/2 -translate-x-1/2 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-90 group-hover:opacity-100'}`}>
                  <span className="font-black text-[10px] md:text-xs tracking-tighter whitespace-nowrap uppercase text-amber-600 bg-white/90 dark:bg-zinc-900/90 px-2 py-0.5 rounded shadow-sm">
                    {data.city}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. YOUTUBE-STYLE SPLIT LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: FEATURED BLOCK (The selected country) */}
          <motion.div 
            key={selectedId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[65%] p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl"
          >
            <div className="flex items-center gap-6 mb-10">
              <div className="relative w-14 h-9 overflow-hidden rounded shadow-sm border border-stone-100 dark:border-zinc-800">
                <Image src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${activeCoord?.code}.svg`} alt={activeData.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#8A3D04] dark:text-amber-200 leading-none">
                  {activeData.name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-2">{activeData.region}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* RESILIENCE LOGIC: Map through Master Data (English) to ensure correct count */}
              {masterData.branches.map((_, index) => {
                // Use translated branch if it exists, otherwise fallback to English branch
                const branch = activeData.branches[index] || masterData.branches[index];
                
                return (
                  <div key={index} className="p-5 rounded-2xl bg-stone-50 dark:bg-zinc-800/40 border border-stone-100 dark:border-zinc-700 flex items-center gap-4 transition-all hover:border-amber-900/20">
                    <div className="p-2.5 rounded-lg bg-amber-900/10 text-amber-900 dark:text-amber-500">
                      <MapPin size={20} />
                    </div>
                    <div className="flex flex-col grow">
                      <span className="text-sm font-black uppercase tracking-tight dark:text-stone-100">{branch.name}</span>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{branch.area}</span>
                    </div>
                    <span className="text-[8px] px-2 py-1 rounded-full bg-stone-200 dark:bg-zinc-700 font-black uppercase tracking-tighter shrink-0">
                      {branch.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: SIDEBAR (Other locations) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 ml-2">Recommended Locations</h4>
            <div className="flex flex-col gap-3 max-h-150 lg:overflow-y-auto lg:pr-3 no-scrollbar">
              <AnimatePresence mode="popLayout">
                {otherLocations.map((coord) => {
                  const data = t.locs[coord.id as keyof typeof t.locs];
                  return (
                    <motion.button
                      layout
                      key={coord.id}
                      onClick={() => setSelectedId(coord.id)}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 hover:border-amber-900/30 hover:shadow-lg transition-all duration-300 group text-left"
                    >
                      <div className="relative w-14 h-9 shrink-0 overflow-hidden rounded grayscale group-hover:grayscale-0 transition-all">
                        <Image src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${coord.code}.svg`} alt={data.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col grow">
                        <span className="text-[15px] font-black uppercase tracking-tight text-stone-600 dark:text-stone-300 group-hover:text-[#8A3D04] dark:group-hover:text-amber-500">
                          {data.name}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase">
                          {data.branches.length} Branches • {data.region}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}