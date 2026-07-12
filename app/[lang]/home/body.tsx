'use client';

import MediaGallery from "@/app/[lang]/home/media-gallery";
import { HomePageData, MediaPurpose } from "@/app/components/types";
import Image from "next/image";
import Link from "next/link";
import OrbitingHero from "./hero";
import GlobalTrace from "./global-trace";
import ThePulse from "./pulse";
import TheStandard from "./certificates";
import TheDispatch from "./news";

interface HomeBodyProps {
  data: HomePageData; 
}

const Body = ({ data }: HomeBodyProps) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
      
      <OrbitingHero/>
      <GlobalTrace /> 

      {/* 2. DYNAMIC CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-20 flex flex-col items-center text-center">
        
        {/* LEGIT ICON SVG (Optimized to Lazy Load Below the Fold) */}
        {data.icon && (
          <div className="mb-10 animate-in fade-in zoom-in duration-1000">
            <Image 
              src={data.icon} 
              alt="Moger Mulluk" 
              width={160} 
              height={160} 
              loading="lazy" // Removed priority, added lazy loading
              className="drop-shadow-2xl"
            />
          </div>
        )}

        {/* DYNAMIC TITLE */}
        <h1 className="mb-8 text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight md:leading-tight lg:leading-tight">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">
            {data.heroTagline}
          </span>
        </h1>
        
        {/* DYNAMIC DESCRIPTION */}
        <p className="max-w-3xl mb-12 text-lg md:text-2xl text-muted-foreground leading-relaxed md:leading-relaxed">
          {data.description}
        </p>

        {/* DYNAMIC CTA */}
        <Link href={'/menu'} className="px-12 py-5 bg-amber-900 hover:bg-amber-950 text-white rounded-full font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
          {data.ctaExplore}
        </Link>
      </div>
      <ThePulse/>

      <TheStandard/>
      <TheDispatch/>
      <MediaGallery purpose={MediaPurpose.GALLERY} limit={100}/>
    </div>
  );
};

export default Body;