"use client";

import React, { useState, useMemo } from 'react';
import { Offer, Locale } from '@/app/components/types';
import { offers } from '@/lib/offers';
import { useLocale, useTranslations } from 'next-intl'; // Import useTranslations
import OfferCard from './card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Body = () => {
    const offerList = offers as Offer[];
    const locale = useLocale() as Locale;
    const t = useTranslations('OffersPage'); // Initialize translations

    // --- STATE ---
    const [statusFilter, setStatusFilter] = useState<string>("active");
    const [sortBy, setSortBy] = useState<string>("recent");

    // --- LOGIC: FILTERING & SORTING ---
    const processedOffers = useMemo(() => {
        const now = new Date();
        let filtered = offerList.filter(offer => !offer.hide);

        filtered = filtered.filter(offer => {
            const start = new Date(offer.validFrom);
            const end = new Date(offer.validUntil);
            if (statusFilter === "active") return now >= start && now <= end;
            if (statusFilter === "upcoming") return now < start;
            if (statusFilter === "archived") return now > end;
            return true;
        });

        return filtered.sort((a, b) => {
            const titleA = a.title[locale].toLowerCase();
            const titleB = b.title[locale].toLowerCase();
            const dateA = new Date(a.validFrom).getTime();
            const dateB = new Date(b.validFrom).getTime();

            switch (sortBy) {
                case "a-z": return titleA.localeCompare(titleB);
                case "z-a": return titleB.localeCompare(titleA);
                case "newest": return dateB - dateA;
                case "oldest": return dateA - dateB;
                default: return a.position - b.position;
            }
        });
    }, [offerList, statusFilter, sortBy, locale]);

    return (
        <div className="p-4 max-w-6xl mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    {/* Updated H1 */}
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
                        {t('title')}
                    </h1>
                    {/* Updated P */}
                    <p className="mt-3 text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
                        {t('subtitle')}
                    </p>
                </div>

                {/* --- SELECTORS --- */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-1">
                            {t('statusLabel')}
                        </label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-35 bg-background border-2">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active Now</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-1">
                            {t('sortLabel')}
                        </label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40 bg-background border-2">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Most Recent</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="a-z">Name (A-Z)</SelectItem>
                                <SelectItem value="z-a">Name (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            {/* --- GRID --- */}
            {processedOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {processedOffers.map((offer) => (
                        <div key={offer.id} className={statusFilter === 'archived' ? 'grayscale opacity-70' : ''}>
                             <OfferCard offer={offer} locale={locale} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-3xl opacity-30">
                    <span className="text-6xl mb-4">📭</span>
                    <p className="font-black uppercase tracking-widest text-sm text-center px-4">
                        {/* Dynamic translation for 'No active offers found' */}
                        {t('noOffers', { status: statusFilter })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Body;