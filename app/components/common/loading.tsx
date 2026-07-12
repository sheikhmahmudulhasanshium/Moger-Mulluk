"use client";
import Image from "next/image";
import logo from '@/public/logo/-4-ezgif.com-effects.webp';
import { useEffect } from "react";

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = "Establishing Connection" }: LoadingProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div 
      role="status" // Announces the loading state to screen readers
      aria-live="polite" 
      aria-busy="true" // Signals to crawlers and screen readers that the system is busy
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black w-screen h-svh"
    >
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        <Image 
          src={logo} 
          alt="Moger Mulluk" 
          fill 
          className="object-contain mix-blend-screen" 
          priority 
          // If this is a static image, remove the "unoptimized" prop below
          // and uncomment the "sizes" property to let Next.js compress it.
          unoptimized 
          // sizes="(max-width: 768px) 192px, 256px" 
        />
      </div>
      
      {/* Dynamic text based on prop */}
      <p className="mt-2 text-yellow-400 text-[14px] md:text-[18px] tracking-[0.2em] animate-pulse font-light uppercase text-center px-4">
        {message}
      </p>
    </div>
  );
}

export default Loading;