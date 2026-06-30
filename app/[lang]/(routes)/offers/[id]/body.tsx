"use client";

import { Locale, OfferWithProducts, ProductDetail } from '@/app/components/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Ticket, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl'; // Import this

interface BodyProps {
    offer: OfferWithProducts;
    locale: Locale;
}

const Body = ({ offer, locale }: BodyProps) => {
    const router = useRouter();
    const t = useTranslations('OfferDetails'); // Initialize translations
    const accent = offer.style.accentColor || "#FFD700";

    // Custom Date Formatter: "1 January 2027"
    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(dateStr));
    };

    return (
        <div className="p-4 max-w-5xl mx-auto py-12 pb-32">
            {/* Back Navigation */}
            <button 
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:-translate-x-1 transition-transform bg-black text-white px-6 py-3 italic border-r-4 border-b-4 border-stone-600 active:border-0"
            >
                <ChevronLeft size={16} /> {t('back')}
            </button>

            <div className="flex flex-col gap-12">
                
                {/* HERO BANNER */}
                <section 
                    className="relative w-full border-[6px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-h-125 flex flex-col md:flex-row"
                    style={{ background: offer.style.background }}
                >
                    <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

                    <div className="relative flex-1 min-h-75 flex items-center justify-center p-8">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none overflow-hidden">
                             <span className="text-[18vw] font-black -rotate-12 uppercase text-white whitespace-nowrap leading-none">
                                {offer.type}
                            </span>
                        </div>
                        <div className="relative w-full h-full min-h-62.5">
                            <Image 
                                src={offer.displayImage || offer.media.image} 
                                alt={offer.title[locale]} 
                                fill
                                className="object-contain drop-shadow-[0_20px_0px_rgba(0,0,0,0.4)]"
                                priority
                            />
                        </div>
                    </div>

                    <div className="flex-1 bg-black/30 backdrop-blur-md border-t-[6px] md:border-t-0 md:border-l-[6px] border-black p-8 flex flex-col justify-center text-white">
                        <div className="inline-block px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black self-start italic">
                            {t('limited')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.85] tracking-tighter mb-6" style={{ color: accent }}>
                            {offer.title[locale]}
                        </h1>
                        <p className="text-lg font-bold leading-tight mb-8 max-w-md opacity-90">
                            {offer.description[locale]}
                        </p>

                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="bg-white text-black p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-[10px] font-black uppercase opacity-50 italic">Offer</p>
                                <p className="text-3xl font-black italic leading-none">{offer.discount[locale]}</p>
                            </div>
                            {offer.promoCode && (
                                <div className="bg-black text-white p-4 border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
                                    <p className="text-[10px] font-black uppercase opacity-50 italic">Code</p>
                                    <p className="text-3xl font-mono font-black italic leading-none text-yellow-400 uppercase tracking-widest">{offer.promoCode}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* AVAILABLE FOR PRODUCTS */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <Sparkles className="text-black shrink-0" size={32} />
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">{t('available')}</h2>
                        <div className="h-2 grow bg-black" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {offer.product_details?.map((product: ProductDetail) => (
                            <Link 
                                key={product._id} 
                                href={`/${locale}/menu/${product.shortId}`}
                                className="group flex items-center gap-6 p-4 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                            >
                                <div className="relative w-24 h-24 shrink-0 border-4 border-black overflow-hidden bg-stone-100">
                                    <Image 
                                        src={product.media?.thumbnail} 
                                        alt={product.title[locale]} 
                                        fill 
                                        className="object-cover group-hover:scale-110 transition-transform" 
                                    />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="overflow-hidden">
                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-black text-white italic">
                                                {product.category}
                                            </span>
                                            <h3 className="text-lg md:text-xl font-black uppercase italic truncate mt-1">
                                                {product.title[locale]}
                                            </h3>
                                        </div>
                                        <span className="text-xl font-black text-red-600">৳{product.logistics.grandTotal}</span>
                                    </div>
                                    <p className="text-xs font-bold text-black/60 line-clamp-2 mt-2 leading-tight italic">
                                        {product.description[locale]}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* STEPS & TERMS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {offer.promoCode && (
                        <div className="bg-black text-white p-8 border-[6px] border-black shadow-[12px_12px_0px_0px_#FFD700]">
                            <div className="flex items-center gap-3 mb-8">
                                <Ticket className="text-yellow-400" size={32} />
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter">{t('how')}</h3>
                            </div>
                            <ul className="space-y-6 font-bold italic text-base">
                                <li className="flex gap-4 items-start">
                                    <span className="bg-yellow-400 text-black px-2 py-1 font-black not-italic leading-none">01</span>
                                    <div>{t('step1')}: <span className="text-yellow-400 font-mono tracking-widest bg-yellow-400/10 px-2 uppercase">{offer.promoCode}</span></div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="bg-yellow-400 text-black px-2 py-1 font-black not-italic leading-none">02</span>
                                    {t('step2')}
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="bg-yellow-400 text-black px-2 py-1 font-black not-italic leading-none">03</span>
                                    {t('step3')}
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-black" size={28} />
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">{t('terms')}</h3>
                        </div>
                        <div className="space-y-6">
                            <p className="text-base font-bold italic leading-snug border-l-4 border-yellow-400 pl-4 py-1">
                                &quot;{offer.conditions[locale]}&quot;
                            </p>
                            <div className="pt-6 border-t-[3px] border-black/10 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase opacity-40">{t('from')}</p>
                                    <p className="text-xs font-black uppercase italic">{formatDate(offer.validFrom)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase opacity-40">{t('until')}</p>
                                    <p className="text-xs font-black uppercase italic text-red-600">{formatDate(offer.validUntil)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Body;