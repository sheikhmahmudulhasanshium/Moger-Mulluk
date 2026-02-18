// app/[lang]/home/body.tsx
'use client';

import UploadMediaForm from "@/app/components/forms/upload-media-form";
import MediaGallery from "@/app/components/media/media-gallery";
import { HomePageData, MediaPurpose } from "@/app/components/types";
import Image from "next/image";

interface HomeBodyProps {
  data: HomePageData; 
}

const Body = ({ data }: HomeBodyProps) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
      
      {/* 1. BACKGROUND VIDEO (Ambient placeholder) */}
      {data.video && (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-20"
            >
              <source src={data.video} type="video/mp4" />
            </video>
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
        </div>
      )}

      {/* 2. DYNAMIC CONTENT CONTAINER (Padding handles script height differences) */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-20 flex flex-col items-center text-center">
        
        {/* LEGIT ICON SVG */}
        {data.icon && (
          <div className="mb-10 animate-in fade-in zoom-in duration-1000">
            <Image 
              src={data.icon} 
              alt="Moger Mulluk" 
              width={160} 
              height={160} 
              priority
              className="drop-shadow-2xl"
            />
          </div>
        )}

        {/* DYNAMIC TITLE - Uses leading-tight for taller scripts */}
        <h1 className="mb-8 text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight md:leading-tight lg:leading-tight">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">
            {data.heroTagline}
          </span>
        </h1>
        
        {/* DYNAMIC DESCRIPTION - leading-relaxed for better legibility in Hindi/Bengali */}
        <p className="max-w-3xl mb-12 text-lg md:text-2xl text-muted-foreground leading-relaxed md:leading-relaxed">
          {data.description}
        </p>

        {/* DYNAMIC CTA */}
        <button className="px-12 py-5 bg-amber-900 hover:bg-amber-950 text-white rounded-full font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
          {data.ctaExplore}
        </button>
      </div>
         <MediaGallery purpose={MediaPurpose.GALLERY} limit={100}/>
          <UploadMediaForm/>
 
    </div>
  );
};

export default Body;