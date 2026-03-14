"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProductGalleryData {
  title: string | { en: string; bn?: string; hi?: string; es?: string };
  media: { thumbnail: string; gallery: string[] };
  _id?: string;
}

interface GalleryProps { product: ProductGalleryData }

const ProductGallery: React.FC<GalleryProps> = ({ product }) => {
  const images = [
    product?.media?.thumbnail,
    ...(product?.media?.gallery || [])
  ].filter(Boolean) as string[];

  const displayTitle = typeof product.title === "string" 
    ? product.title 
    : product.title?.en || "Product";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const autoChangeTime = 3000; 
  const tickRate = 30; 

  // Navigation Logic - Resets progress during the click event
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setProgress(0);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setProgress(0);
  }, [images.length]);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Fixed Timer Logic: State updates only happen inside the Interval callback
  useEffect(() => {
    // If paused or only one image, we simply don't start the interval
    if (isPaused || images.length <= 1) return;

    const increment = (tickRate / autoChangeTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Instead of an effect watching 'progress', 
          // we trigger the image change right here
          setCurrentIndex((curr) => (curr + 1) % images.length);
          return 0;
        }
        return prev + increment;
      });
    }, tickRate);

    return () => clearInterval(timer);
  }, [isPaused, images.length, autoChangeTime]);

  if (images.length === 0) return <div className="aspect-square bg-muted rounded-3xl animate-pulse" />;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div 
        className="relative aspect-square w-full rounded-3xl overflow-hidden border bg-white shadow-xl group"
        onMouseEnter={() => {
          setIsPaused(true);
          setProgress(0); // Resetting progress on event is fine
        }}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Image
          src={images[currentIndex]}
          alt={displayTitle}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500"
          priority
        />

        {/* TIMER (Hidden when paused) */}
        {images.length > 1 && !isPaused && (
          <div className="absolute top-4 right-4 z-20 bg-black/10 backdrop-blur-md rounded-full p-1">
            <svg width="36" height="36" className="-rotate-90">
              <circle cx="18" cy="18" r={radius} className="stroke-white/20 fill-none" strokeWidth="3" />
              <circle
                cx="18" cy="18" r={radius}
                className="stroke-yellow-500 fill-none transition-all duration-30 ease-linear"
                strokeWidth="3"
                strokeDasharray={circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* ARROWS */}
        {images.length > 1 && (
          <>
            <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:bg-white">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:bg-white">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToImage(index)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === index ? "border-yellow-500 ring-2 ring-yellow-500/10 scale-95" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="thumb" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;