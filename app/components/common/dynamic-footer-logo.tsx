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
      <svg
        viewBox="0 0 100 110"
        className="w-full h-auto max-h-75 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M -500,65 L 10,65 A 40,40 0 0 1 90,65 L 600,65" 
          fill="none" 
          stroke="#8A3D04" /* Changed from #B28869 to #8A3D04 for higher contrast */
          strokeWidth="1.2" 
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke" 
        />

        <foreignObject x="25" y="20" width="50" height="60">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/favicon/web-app-manifest-512x512.png"
              alt="Footer Logo Icon"
              fill
              className="object-contain"
              priority
              sizes="120px"
            />
          </div>
        </foreignObject>

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

      <div className="w-full -mt-2">
        <h2 
          className={`
            ${getFontClass()}
            text-xl 
            font-semibold 
            mb-4 
            text-[#8A3D04] /* Changed from #B28869 to #8A3D04 for higher contrast */
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