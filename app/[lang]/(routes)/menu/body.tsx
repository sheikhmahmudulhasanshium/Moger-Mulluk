'use client'
import { useMemo, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Trans } from "@/lib/menu";
import { Loader2, Sparkles, Leaf } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"; 
import { Product, productApi } from "@/app/components/hooks/product-api";

const Body = () => {
    const locale = useLocale();
    const activeTrans = Trans[locale.toUpperCase()] || Trans.EN;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cScore, setCScore] = useState(3240);
    const [tScore, setTScore] = useState(3190);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const data = await productApi.getPublicMenu();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load live menu", error);
            } finally {
                setLoading(false);
            }
        };
        loadMenu();
    }, []);

    // Categorize and Sort
    const coffees = useMemo(() => 
        products.filter(p => p.category === 'coffee').sort((a,b) => a.position - b.position), 
    [products]);

    const teas = useMemo(() => 
        products.filter(p => p.category === 'tea').sort((a,b) => a.position - b.position), 
    [products]);

    const otherBevs = useMemo(() => 
        products.filter(p => !['tea', 'coffee'].includes(p.category)), 
    [products]);

    useEffect(() => {
        const i = setInterval(() => { 
            setCScore(s => s + Math.floor(Math.random() * 2)); 
            setTScore(s => s + Math.floor(Math.random() * 2)); 
        }, 5000);
        return () => clearInterval(i);
    }, []);

    const videoUrl = useMemo(() => {
        const videoId = process.env.NEXT_PUBLIC_YT_LINK;
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1` : null;
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-amber-900" />
                <p className="mt-4 font-black italic uppercase tracking-widest text-[10px] opacity-50">Synchronizing Realm...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-4 pb-20 overflow-x-hidden">
            {/* Video Hero */}
            <div className="relative w-full py-8 md:py-16 flex justify-center border-b-4 border-amber-900/20 bg-black">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')" }}
                />
                {videoUrl && (
                    <div className="relative z-10 w-full max-w-70 md:max-w-78.75 aspect-9/16 overflow-hidden rounded-[3rem] shadow-2xl bg-black border-4 border-white/20">
                        <iframe className="absolute inset-0 w-full h-full pointer-events-none" src={videoUrl} title="Hero" allow="autoplay; encrypted-media" />
                    </div>
                )}
            </div>

            <h1 className="text-center text-3xl md:text-5xl font-black italic uppercase tracking-tighter mt-10 mb-4 px-2">Choose Your Team</h1>

            <div className="grid grid-cols-2 gap-4 md:gap-20 px-2 md:px-12 max-w-7xl mx-auto w-full mb-8">
                
                {/* COFFEE COLUMN (Left) */}
                <div className="flex flex-col gap-4 text-left">
                    <div className="border-b-4 border-amber-900 pb-1 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 md:h-8 md:w-8 text-amber-900" />
                        <div>
                            <h2 className="text-xl md:text-5xl font-black text-amber-900 leading-none">COFFEE</h2>
                            <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Energy</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 md:gap-12">
                        {coffees.map(x => (
                            <HoverCard key={x._id} openDelay={100} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link href={`/menu/${x.shortId}`} className="flex flex-row gap-3 md:gap-6 cursor-pointer group" onClick={() => setCScore(s => s + 1)}>
                                        {/* Thumbnail Left */}
                                        <div className="relative shrink-0 w-12 h-12 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-amber-900/10 group-hover:border-amber-700 transition-all shadow-sm bg-stone-100 dark:bg-stone-900">
                                            {x.media?.thumbnail ? (
                                                <Image src={x.media.thumbnail} alt={x.title[locale] || x.title['en']} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="96px" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300 text-[8px] font-black uppercase tracking-tighter">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 grow">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                                                <h3 className="text-sm md:text-2xl font-black group-hover:text-amber-700 uppercase leading-none transition-colors">{x.title[locale] || x.title['en']}</h3>
                                                <span className="font-mono font-black text-amber-900 text-xs md:text-xl">৳{x.logistics.grandTotal}</span>
                                            </div>
                                            <p className="hidden md:block text-base text-muted-foreground leading-tight font-medium opacity-80 italic line-clamp-2">{x.description[locale] || x.description['en']}</p>
                                        </div>
                                    </Link>
                                </HoverCardTrigger>
                                <HoverCardContent align="start" className="w-64 border-2 border-amber-900 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Benefits</h4>
                                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-900">✨ {x.healthBenefit?.[locale] || x.healthBenefit?.['en'] || 'Essential Energy'}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground italic">Origin: {x.origin?.[locale] || x.origin?.['en'] || 'Global Selection'}</p>
                                        <div className="h-px bg-amber-900/10 w-full" />
                                        <p className="text-[11px] font-medium leading-relaxed italic text-stone-600">&quot;{x.funFact?.[locale] || x.funFact?.['en'] || 'Handcrafted brew'}&quot;</p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </div>
                </div>

                {/* TEA COLUMN (Right) */}
                <div className="flex flex-col gap-4 text-right">
                    <div className="border-b-4 border-green-800 pb-1 flex flex-row-reverse items-center gap-2">
                        <Leaf className="h-4 w-4 md:h-8 md:w-8 text-green-800" />
                        <div>
                            <h2 className="text-xl md:text-5xl font-black text-green-800 leading-none">TEA</h2>
                            <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Peace</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 md:gap-12">
                        {teas.map(x => (
                            <HoverCard key={x._id} openDelay={100} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link href={`/menu/${x.shortId}`} className="flex flex-row-reverse gap-3 md:gap-6 cursor-pointer group text-right" onClick={() => setTScore(s => s + 1)}>
                                        {/* Thumbnail Right */}
                                        <div className="relative shrink-0 w-12 h-12 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-green-800/10 group-hover:border-green-700 transition-all shadow-sm bg-stone-100 dark:bg-stone-900">
                                            {x.media?.thumbnail ? (
                                                <Image src={x.media.thumbnail} alt={x.title[locale] || x.title['en']} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="96px" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300 text-[8px] font-black uppercase tracking-tighter">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 grow">
                                            <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-baseline gap-1">
                                                <span className="font-mono font-black text-green-800 text-xs md:text-xl">৳{x.logistics.grandTotal}</span>
                                                <h3 className="text-sm md:text-2xl font-black group-hover:text-green-700 uppercase leading-none transition-colors">{x.title[locale] || x.title['en']}</h3>
                                            </div>
                                            <p className="hidden md:block text-base text-muted-foreground leading-tight font-medium opacity-80 italic line-clamp-2">{x.description[locale] || x.description['en']}</p>
                                        </div>
                                    </Link>
                                </HoverCardTrigger>
                                <HoverCardContent align="end" className="w-64 border-2 border-green-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-left">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-black text-green-800 uppercase tracking-widest">Benefits</h4>
                                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-800">🍃 {x.healthBenefit?.[locale] || x.healthBenefit?.['en'] || 'Natural Calm'}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground italic">Origin: {x.origin?.[locale] || x.origin?.['en'] || 'Mountain Harvest'}</p>
                                        <div className="h-px bg-green-800/10 w-full" />
                                        <p className="text-[11px] font-medium leading-relaxed italic text-stone-600">&quot;{x.funFact?.[locale] || x.funFact?.['en'] || 'Traditional steep'}&quot;</p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scoreboard */}
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

            {/* CTAs */}
            <div className="flex flex-row justify-center gap-3 px-4 py-8">
                <Link href="/pre-order" className="flex-1 max-w-40 bg-amber-900 text-white text-center py-3 rounded-xl font-black text-xs uppercase shadow-lg active:scale-95 transition-transform">{activeTrans.ctaOrder}</Link>
                <Link href="/book-table" className="flex-1 max-w-40 border-2 border-green-800 text-green-800 text-center py-3 rounded-xl font-black text-xs uppercase active:scale-95 transition-transform">{activeTrans.ctaBook}</Link>
            </div>

            {/* Other Refreshments */}
            <div className="max-w-7xl mx-auto w-full px-4 md:px-12 mt-12 space-y-12">
                <h2 className="text-2xl md:text-4xl font-black uppercase border-b-4 border-gray-900 inline-block">More Refreshments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {otherBevs.map(x => (
                        <Link href={`/menu/${x.shortId}`} key={x._id} className="group flex items-center gap-4 border-l-2 border-stone-200 pl-4 py-2 hover:border-amber-600 transition-all">
                            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border bg-stone-50">
                                {x.media?.thumbnail && <Image src={x.media.thumbnail} alt="" fill className="object-cover" />}
                            </div>
                            <div className="grow">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-black text-sm uppercase group-hover:text-amber-700 transition-colors">{x.title[locale] || x.title['en']}</h4>
                                    <span className="font-mono font-bold text-xs opacity-60">৳{x.logistics.grandTotal}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic leading-tight line-clamp-1">{x.description[locale] || x.description['en']}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Body;