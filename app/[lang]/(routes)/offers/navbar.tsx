"use client";

import  { useState, useEffect } from 'react';
import { OfferStats } from '@/app/components/types';
import { Skeleton } from "@/components/ui/skeleton";
import { offerApi } from '@/app/components/hooks/offer-api';

interface OfferTypeNavbarProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const OfferTypeNavbar = ({ selectedType, onTypeChange }: OfferTypeNavbarProps) => {
  const [stats, setStats] = useState<OfferStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Navbar handles its own data lifecycle independently
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await offerApi.getStats();
        setStats(data);
      } catch (err) {
        console.error("Navbar Stats failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-12 pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 min-w-25 border-2 border-black" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-2 mb-12 pb-2">
      {/* 1. Category Breakdown (Rendered First) */}
      {stats?.breakdown.map((item) => (
        <button
          key={item._id}
          onClick={() => onTypeChange(item._id)}
          className={`px-4 py-2 border-2 border-black font-black uppercase text-xs transition-all whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
            selectedType === item._id ? "bg-red-500 text-white" : "bg-white text-black"
          }`}
        >
          {item._id.replace('-', ' ')}
          <span className={`ml-2 text-[10px] font-bold ${selectedType === item._id ? "text-white" : "text-red-600"}`}>
            ({item.c})
          </span>
        </button>
      ))}

      {/* 2. ALL Button (Pushed to the Right) */}
      <button
        onClick={() => onTypeChange("all")}
        className={`px-4 py-2 border-2 border-black font-black uppercase text-xs transition-all whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
          selectedType === "all" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        ALL <span className="ml-1 opacity-50">({stats?.total || 0})</span>
      </button>
    </div>
  );
};

export default OfferTypeNavbar;