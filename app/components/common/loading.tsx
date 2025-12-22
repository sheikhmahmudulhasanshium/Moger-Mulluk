import Image from "next/image";
import logo from '../../../public/logo/-4-ezgif.com-effects.webp'

const Loading = () => {
  return (
    /* 
       1. Changed z-9999 to z-[9999] (The brackets are required for custom numbers)
       2. Changed h-screen to h-svh (Small Viewport Height) for better mobile support
    */
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black w-screen h-svh">
      
      {/* 
         On small screens (phones), w-64 is safer. 
         On md and up, it grows to w-96.
      */}
      <div className="relative w-64 h-64 md:w-96 md:h-96">
        <Image 
          src={logo} 
          alt="loading..." 
          fill
          className="object-contain mix-blend-screen"
          priority 
          unoptimized // HIGHLY recommended for animated WebP on mobile browsers
        />
      </div>

      <p className="mt-4 text-zinc-400 text-sm tracking-widest animate-pulse font-medium">
        PLEASE WAIT...
      </p>
    </div>
  );
}

export default Loading;