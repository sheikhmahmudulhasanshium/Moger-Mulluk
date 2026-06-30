"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Offer, Locale } from '@/app/components/types';
import { useLocale, useTranslations } from 'next-intl';
import OfferCard from './card';
import OfferTypeNavbar from './navbar';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { offerApi } from '@/app/components/hooks/offer-api';

type OfferStatus = 'recent' | 'upcoming' | 'archived';

const Body = () => {
    const locale = useLocale() as Locale;
    const t = useTranslations('OffersPage');

    const [offerList, setOfferList] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [statusFilter, setStatusFilter] = useState<OfferStatus>("recent");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("default");

    // DATA FETCHING: Only fetch when selectedType or statusFilter changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data: Offer[];
                if (selectedType === "all") {
                    // Fetch by status (recent/upcoming/archived) for ALL categories
                    data = await offerApi.getByStatus(statusFilter);
                } else {
                    // Fetch all items of this TYPE, then we filter status locally for precision
                    data = await offerApi.getByType(selectedType);
                }
                setOfferList(data);
            } catch (error) {
                console.error("Content fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedType, statusFilter]);

    // FILTERING & SORTING ENGINE
    const processedOffers = useMemo(() => {
        const now = new Date();
        
        // 1. Time-based filtering (Required for when we fetch by Type)
        const filtered = offerList.filter(offer => {
            if (offer.hide) return false;
            
            const start = new Date(offer.validFrom);
            const end = new Date(offer.validUntil);

            if (statusFilter === "recent") return now >= start && now <= end;
            if (statusFilter === "upcoming") return now < start;
            if (statusFilter === "archived") return now > end;
            return true;
        });

        // 2. Sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "a-z": return (a.title[locale] || '').localeCompare(b.title[locale] || '');
                case "value": return (b.discountValue || 0) - (a.discountValue || 0);
                case "newest": return new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime();
                default: return a.position - b.position;
            }
        });
    }, [offerList, sortBy, locale, statusFilter]);

    return (
        <div className="p-4 max-w-6xl mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-8">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
                        {t('title')}
                    </h1>
                    <p className="mt-3 text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Status</label>
                        <Select 
                            value={statusFilter} 
                            onValueChange={(val) => setStatusFilter(val as OfferStatus)}
                        >
                            <SelectTrigger className="w-35 bg-background border-2 border-black font-bold">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Active Now</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Sort</label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40 bg-background border-2 border-black font-bold">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="value">Highest Value</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="a-z">A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            <OfferTypeNavbar 
                selectedType={selectedType} 
                onTypeChange={setSelectedType} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-[80svh] w-full border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" />
                    ))
                ) : processedOffers.length > 0 ? (
                    processedOffers.map((offer, index) => (
                        <div key={offer.id} className={statusFilter === 'archived' ? 'grayscale opacity-70' : ''}>
                             <OfferCard offer={offer} locale={locale} index={index} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 border-4 border-black border-dashed rounded-3xl opacity-30">
                        <span className="text-6xl mb-4">📭</span>
                        <p className="font-black uppercase tracking-widest text-sm text-center px-4">
                            No {statusFilter} {selectedType !== 'all' ? selectedType : ''} offers found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Body;