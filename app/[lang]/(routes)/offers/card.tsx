"use client";

import { Offer, Locale } from '@/app/components/types';
import Image from 'next/image';
import Link from 'next/link'; // 1. Import Link

interface OfferCardProps {
  offer: Offer;
  locale: Locale;
  index?: number;
}

const OfferCard = ({ offer, locale, index = 0 }: OfferCardProps) => {
  const accent = offer.style.accentColor || "#FFD700";
  const isPriority = index < 2;

  const cardImage = offer.displayImage || offer.media.image;

  return (
    <div
      className="group relative flex h-[80svh] w-full flex-col overflow-hidden border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
      style={{ background: offer.style.background }}
    >
      <div className="z-30 border-b-[6px] border-black bg-black px-4 py-2 flex justify-between items-center">
        <span 
            className="font-black uppercase tracking-widest text-[10px]"
            style={{ color: accent }}
        >
          {offer.type.replace('-', ' ')}
        </span>
        <span className="text-white font-black italic text-[10px] opacity-50">MOGER MULLUK</span>
      </div>

      <div className="relative flex-[1.5] flex items-center justify-center m-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
            <span className="text-[12vh] font-black -rotate-12 uppercase text-white leading-none">
                {offer.discount[locale].split(' ')[0]}
            </span>
        </div>

        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
            <Image
                src={cardImage}
                alt={offer.title[locale]}
                fill
                priority={isPriority} 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain drop-shadow-[0_15px_0px_rgba(0,0,0,0.4)]"
            />
        </div>

        <div 
            className="absolute top-4 right-0 z-30 flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: accent }}
        >
          <span className="text-lg font-black leading-tight uppercase tracking-tighter text-black text-center">
            {offer.discount[locale]}
          </span>
        </div>
      </div>

      <div className="z-20 m-4 mt-0 bg-black/40 backdrop-blur-md border-4 border-black p-5 flex flex-col justify-between flex-1">
        <div>
            <h2 
                className="text-4xl font-black uppercase italic leading-[0.9] tracking-tighter mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                style={{ color: accent }}
            >
            {offer.title[locale]}
            </h2>
            <p className="text-sm font-bold leading-snug text-white line-clamp-2">
               {offer.description[locale]}
            </p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
            {offer.promoCode && (
                <div className="bg-white border-[3px] border-black p-2 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                    <span className="text-[9px] font-black uppercase text-black/40">Use Code</span>
                    <span className="text-xl font-mono font-black text-black">{offer.promoCode}</span>
                </div>
            )}

            <div className="flex items-end justify-between gap-2">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-white/50">Terms:</span>
                    <span className="text-[10px] font-bold italic text-white/90 leading-tight">
                        {offer.conditions[locale]}
                    </span>
                </div>
                
                {/* 2. Changed div to Link and added href */}
                <Link 
                    href={`/${locale}/offers/${offer.id}`} 
                    className="h-12 w-12 flex items-center justify-center border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:brightness-110 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer group/btn"
                    style={{ backgroundColor: accent }}
                >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="28" 
                      height="28" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="black" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transition-transform group-hover/btn:translate-x-1"
                    >
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                </Link>
            </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    </div>
  );
};

export default OfferCard;