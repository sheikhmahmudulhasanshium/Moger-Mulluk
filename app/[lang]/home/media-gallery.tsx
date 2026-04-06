"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { AppMessages, Media, MediaPurpose } from '@/app/components/types';
import { mediaApi } from '@/app/components/hooks/media-api';
import { Button } from '@/components/ui/button';
import { Link } from "@/i18n/routing"; 
import { useMessages } from 'next-intl';

interface MediaGalleryProps {
  purpose?: MediaPurpose;
  limit?: number;
}

export default function MediaGallery({ purpose, limit = 12 }: MediaGalleryProps) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 1. Setup translations
  const messages = useMessages() as unknown as AppMessages;
  const GalleryText = messages.Navigation.gallery;
  const StepInsideText = messages.Navigation.stepInside; // <--- Make sure this exists in your JSON

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await mediaApi.getMedia(1, limit, purpose);
        setItems(response.data);
        setError(null);
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
      <div className="flex flex-col items-center justify-center py-40 bg-[#fcfaf7] dark:bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-[#8A3D04]/40" />
      </div>
    );
  }

  if (error || items.length === 0) return null;

  return (
    <section className="relative w-full bg-[#fcfaf7] dark:bg-zinc-950 transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <h2 className="text-[#8A3D04] dark:text-[#e7d9c1] text-5xl md:text-8xl font-black tracking-tighter leading-none">
          {GalleryText}
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {items.map((item) => (
            <div 
              key={item._id} 
              className="relative group break-inside-avoid rounded-xl overflow-hidden bg-stone-200/50 dark:bg-zinc-900 transition-all duration-700 hover:shadow-2xl"
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
                  className="w-full h-auto object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                <span className="text-[8px] text-white/60 font-medium uppercase tracking-[0.3em]">
                  {item.name.split('-')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. THE CTA FOOTER WITH TRANSLATED BUTTON */}
        <div className="mt-24 pb-24 flex flex-col items-center">
          <Link href="/gallery" className="group relative">
            <Button 
              className="relative z-10 px-12 py-7 bg-[#8A3D04] hover:bg-[#6d3003] text-[#fcfaf7] rounded-full font-black text-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-none"
            >
              {/* FIXED: Using translated variable here */}
              {StepInsideText}
            </Button>
            <div className="absolute inset-0 bg-[#8A3D04] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#fcfaf7] dark:from-zinc-950 to-transparent" />
    </section>
  );
}