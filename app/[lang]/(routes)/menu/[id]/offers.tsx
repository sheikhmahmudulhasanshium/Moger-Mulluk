// app/[lang]/(routes)/menu/[id]/available-offers.tsx
"use client";

import { Offer, Locale } from "@/app/components/types";
import { Ticket, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  offers: Offer[];
  locale: Locale;
}

const AvailableProductOffers = ({ offers, locale }: Props) => {
  if (offers.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 border-b-4 border-black dark:border-stone-800 pb-2">
        <Ticket className="h-5 w-5 text-red-600" />
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-black dark:text-white">
          Exclusive Offers
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {offers.map((offer) => (
          <Link 
            key={offer.id}
            href={`/${locale}/offers/${offer.id}`}
            className="group relative flex items-center justify-between p-4 border-4 border-black dark:border-stone-700 bg-white dark:bg-stone-900 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            {/* Visual background matching the offer style (subtle) */}
            <div 
                className="absolute inset-y-0 left-0 w-2 opacity-80"
                style={{ background: offer.style.accentColor || '#FFD700' }}
            />

            <div className="pl-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase bg-black text-white dark:bg-stone-200 dark:text-black px-2 italic">
                    {offer.type.replace('-', ' ')}
                </span>
              </div>
              <h4 className="text-lg font-black uppercase italic leading-none mt-1 text-black dark:text-white group-hover:text-red-600 transition-colors">
                {offer.title[locale]}
              </h4>
              <p className="text-[10px] font-bold text-red-600 dark:text-yellow-400 mt-1">
                {offer.discount[locale]} {offer.promoCode && `• Use: ${offer.promoCode}`}
              </p>
            </div>

            <div className="bg-black dark:bg-stone-200 text-white dark:text-black p-2 group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AvailableProductOffers;