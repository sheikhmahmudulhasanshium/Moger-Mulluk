'use client';

import {  useLocale, useTranslations } from 'next-intl';
import { localesConfig, routing } from '@/i18n/routing'; 
import Image from 'next/image';

export default function DynamicLogo() {
  const locale = useLocale();
  const t = useTranslations('Logo');

  const currentLocale = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;

  const countryCode =
    localesConfig[currentLocale as keyof typeof localesConfig]?.country || 'BD';

  const brandName = t('brandName');

  const getFontClass = () => {
    switch (locale) {
      case 'bn':
        return 'font-["Noto_Sans_Bengali"]';
      case 'hi':
        return 'font-["Noto_Sans_Devanagari"]';
      default:
        return 'font-sans';
    }
  };

  return (
    /*
      IMPORTANT:
      - Height is controlled by header
      - Width is derived from aspect ratio
      - No w-full anywhere
    */
    <div
      className="
        flex
        h-full
        max-h-20
        aspect-3/1
        items-end
        gap-x-2
        p-2
        select-none
        shrink-0
      "
    >
      {/* ICON */}
      <div className="relative h-[85%] aspect-square">
        <Image
          src="/logo/logo.svg"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* TEXT STACK */}
      <div className="flex flex-col items-end justify-end h-full">
        {/* COUNTRY CODE */}
        <div className="px-1.5 py-0.5 rounded-[3px] mb-1">
          <span className="text-[10px] font-bold text-[#B28869] leading-none uppercase tracking-widest font-sans">
            {countryCode}
          </span>
        </div>

        {/* BRAND NAME */}
        <h1
          className={`
            ${getFontClass()}
            text-[#8A3D04]
            text-lg sm:text-xl
            font-black
            leading-none
            tracking-tighter
            pb-2
            whitespace-nowrap
          `}
        >
          {brandName}
        </h1>
      </div>
    </div>
  );
}
