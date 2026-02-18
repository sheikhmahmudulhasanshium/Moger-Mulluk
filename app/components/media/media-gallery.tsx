"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Loader2, AlertCircle } from "lucide-react";
import { mediaApi } from "../hooks/media-api";
import { Media, MediaPurpose } from "../types";

interface MediaGalleryProps {
  purpose?: MediaPurpose;
  limit?: number;
}

export default function MediaGallery({ purpose, limit = 12 }: MediaGalleryProps) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await mediaApi.getMedia(1, limit, purpose);
        setItems(response.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load gallery';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [purpose, limit]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
        <p className="mt-4 text-sm text-muted-foreground italic">Fetching the realm of conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-sm font-bold">{error}</p>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {items.map((item) => (
          <div 
            key={item._id} 
            className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-all hover:shadow-xl"
          >
            {item.resourceType === 'video' ? (
              <video 
                src={item.url} 
                className="w-full h-auto" 
                muted 
                loop 
                onMouseOver={(e) => void e.currentTarget.play()}
                onMouseOut={(e) => void e.currentTarget.pause()}
              />
            ) : (
              <Image 
                src={item.url} 
                alt={item.name}
                width={item.width}
                height={item.height}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            )}
            
            {/* Hover Meta Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white text-[10px] font-bold truncate uppercase tracking-widest">
                {item.name.split('-')[0]}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[8px] text-amber-200 font-black uppercase">
                  {item.purpose}
                </span>
                <span className="text-[8px] text-white/60">
                  {item.format.toUpperCase()} • {item.width}px
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}