'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

export default function DynamicFooterLogo() {
  const locale = useLocale();
  const tLogo = useTranslations('Logo');
  const tFooter = useTranslations('Footer');

  const brandName = tLogo('brandName');
  const tagline = tFooter('tagline');

  const getFontClass = () => {
    switch (locale) {
      case 'bn': return 'font-["Noto_Sans_Bengali"]';
      case 'hi': return 'font-["Noto_Sans_Devanagari"]';
      default: return 'font-sans';
    }
  };

  const getFontFamily = () => {
    switch (locale) {
      case 'bn': return '"Noto Sans Bengali", sans-serif';
      case 'hi': return '"Noto Sans Devanagari", sans-serif';
      default: return 'ui-sans-serif, system-ui, sans-serif';
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center overflow-x-hidden select-none">
      
      {/* 
        SVG Layer:
        - ViewBox adjusted to 0 0 100 110 to give more bottom room for the text dip.
        - Dome Radius increased to 40 (spanning 80 units wide).
      */}
      <svg
        viewBox="0 0 100 110"
        className="w-full h-auto max-h-[300px] overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. THE DOME WITH INFINITE WINGS 
            - Dome starts at x=10 and ends at x=90 (Radius 40).
            - Peak of the dome is now at y=25.
        */}
        <path 
          d="M -500,65 L 10,65 A 40,40 0 0 1 90,65 L 600,65" 
          fill="none" 
          stroke="#B28869" 
          strokeWidth="1.2" 
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke" 
        />

        {/* 2. ICON (Centered and lifted to fit the higher dome) */}
        <foreignObject x="25" y="20" width="50" height="60">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/logo/logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </foreignObject>

        {/* 3. BRAND NAME (Reverse Arc / Smile) 
            - Lowered path to accommodate the larger dome radius.
        */}
        <defs>
          <path id="footerSmile" d="M 5,78 Q 50,108 95,78" />
        </defs>
        <text
          fill="#8A3D04"
          style={{
            fontFamily: getFontFamily(),
            fontSize: '11.5px',
            fontWeight: 900,
          }}
        >
          <textPath 
            href="#footerSmile" 
            startOffset="50%" 
            textAnchor="middle"
          >
            {brandName}
          </textPath>
        </text>
      </svg>

      {/* 4. TAGLINE (Exactly: text-xl font-semibold mb-4) */}
      <div className="w-full -mt-2">
        <h2 
          className={`
            ${getFontClass()}
            text-xl 
            font-semibold 
            mb-4 
            text-[#B28869] 
            text-center 
            text-wrap 
            leading-tight
            px-6
          `}
        >
          {tagline}
        </h2>
      </div>
    </div>
  );
}