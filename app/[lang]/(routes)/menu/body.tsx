'use client'
import React, { useMemo, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"; // Adjust path based on your setup
import { mapMenu, MasterCoffee, MasterTea, Trans } from "@/lib/menu";

const Body = () => {
    const locale = useLocale();
    const activeTrans = Trans[locale.toUpperCase()] || Trans.EN;
    const teas = useMemo(() => mapMenu(MasterTea, activeTrans), [activeTrans]);
    const coffees = useMemo(() => mapMenu(MasterCoffee, activeTrans), [activeTrans]);
    
    const [cScore, setCScore] = useState(3240);
    const [tScore, setTScore] = useState(3190);

    useEffect(() => {
        const i = setInterval(() => { 
            setCScore(s => s + Math.floor(Math.random() * 2)); 
            setTScore(s => s + Math.floor(Math.random() * 2)); 
        }, 5000);
        return () => clearInterval(i);
    }, []);

    const videoUrl = useMemo(() => {
        const videoId = process.env.NEXT_PUBLIC_YT_LINK;
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0` : null;
    }, []);

    return (
        <div className="flex flex-col w-full gap-4 pb-20 overflow-x-hidden">
            {/* Video Section */}
            <div className="flex justify-center px-4 pt-4">
                {videoUrl && (
                    <div className="relative w-full max-w-[280px] md:max-w-[315px] aspect-9/16 overflow-hidden rounded-3xl shadow-2xl bg-black border-4 border-white/10">
                        <iframe className="absolute inset-0 w-full h-full pointer-events-none" src={videoUrl} title="Hero" allow="autoplay; encrypted-media" />
                    </div>
                )}
            </div>

            <h1 className="text-center text-3xl md:text-5xl font-black italic uppercase tracking-tighter mt-10 mb-4 px-2">Choose Your Team</h1>

            <div className="grid grid-cols-2 gap-4 md:gap-20 px-2 md:px-12 max-w-7xl mx-auto w-full mb-8">
                
                {/* Coffee Column */}
                <div className="flex flex-col gap-4 text-left">
                    <div className="border-b-4 border-amber-900 pb-1">
                        <h2 className="text-xl md:text-5xl font-black text-amber-900 leading-none">COFFEE</h2>
                        <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Energy</p>
                    </div>
                    <div className="flex flex-col gap-8 md:gap-12">
                        {coffees.map(x => (
                            <HoverCard key={x.id} openDelay={100} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => setCScore(s => s + 1)}>
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                                            <h3 className="text-sm md:text-2xl font-black group-hover:text-amber-700 uppercase leading-none transition-colors">{x.title}</h3>
                                            <span className="font-mono font-black text-amber-900 text-xs md:text-xl">৳{x.priceBDT}</span>
                                        </div>
                                        <p className="text-[10px] md:text-base text-muted-foreground leading-none font-medium opacity-80 italic line-clamp-2">{x.description}</p>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent align="start" className="w-64 border-2 border-amber-900 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-black text-amber-900 uppercase">Benefits</h4>
                                            <span className="text-[10px]  px-2 py-0.5 rounded-full font-bold">✨ {x.additionalInfo.hb}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-muted-foreground italic">Origin: {x.additionalInfo.o}</p>
                                        <div className="h-px bg-amber-900/10 w-full" />
                                        <p className="text-xs font-medium leading-relaxed">&quot;{x.additionalInfo.f}&quot;</p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </div>
                </div>

                {/* Tea Column */}
                <div className="flex flex-col gap-4 text-right">
                    <div className="border-b-4 border-green-800 pb-1">
                        <h2 className="text-xl md:text-5xl font-black text-green-800 leading-none">TEA</h2>
                        <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Peace</p>
                    </div>
                    <div className="flex flex-col gap-8 md:gap-12">
                        {teas.map(x => (
                            <HoverCard key={x.id} openDelay={100} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <div className="flex flex-col gap-1 cursor-pointer group text-right" onClick={() => setTScore(s => s + 1)}>
                                        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-baseline gap-1">
                                            <span className="font-mono font-black text-green-800 text-xs md:text-xl">৳{x.priceBDT}</span>
                                            <h3 className="text-sm md:text-2xl font-black group-hover:text-green-700 uppercase leading-none transition-colors">{x.title}</h3>
                                        </div>
                                        <p className="text-[10px] md:text-base text-muted-foreground leading-none font-medium opacity-80 italic line-clamp-2">{x.description}</p>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent align="end" className="w-64 border-2 border-green-800 backdrop-blur-sm rounded-xl p-4 shadow-xl text-left">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-black text-green-800 uppercase">Benefits</h4>
                                            <span className="text-[10px]  px-2 py-0.5 rounded-full font-bold">🍃 {x.additionalInfo.hb}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-muted-foreground italic">Origin: {x.additionalInfo.o}</p>
                                        <div className="h-px bg-green-800/10 w-full" />
                                        <p className="text-xs font-medium leading-relaxed">&quot;{x.additionalInfo.f}&quot;</p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scoreboard & CTA remain the same... */}
            <div className="max-w-xl mx-auto w-full px-4 pt-10">
                <p className="font-bold text-2xl text-center">Score Board</p>
                <div className="flex justify-between items-end mb-1 px-1">
                    <div className="text-left"><span className="block text-[10px] uppercase font-black opacity-40">{activeTrans.fans}</span><span className="text-xl font-black text-amber-900">{cScore.toLocaleString()}</span></div>
                    <div className="bg-black text-white px-3 py-0.5 text-[10px] font-black italic rounded-t-lg">{activeTrans.vs}</div>
                    <div className="text-right"><span className="block text-[10px] uppercase font-black opacity-40">{activeTrans.fans}</span><span className="text-xl font-black text-green-800">{tScore.toLocaleString()}</span></div>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex border-2 border-white shadow-inner">
                    <div style={{ width: `${(cScore / (cScore + tScore)) * 100}%` }} className="h-full bg-amber-900 transition-all duration-1000" />
                    <div style={{ width: `${(tScore / (cScore + tScore)) * 100}%` }} className="h-full bg-green-700 transition-all duration-1000" />
                </div>
            </div>

            <div className="flex flex-row justify-center gap-3 px-4 py-8">
                <Link href="/pre-order" className="flex-1 max-w-40 bg-amber-900 text-white text-center py-3 rounded-xl font-black text-xs uppercase shadow-lg active:scale-95 transition-transform">{activeTrans.ctaOrder}</Link>
                <Link href="/book-table" className="flex-1 max-w-40 border-2 border-green-800 text-green-800 text-center py-3 rounded-xl font-black text-xs uppercase active:scale-95 transition-transform">{activeTrans.ctaBook}</Link>
            </div>
        </div>
    );
}

export default Body;