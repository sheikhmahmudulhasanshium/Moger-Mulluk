"use client";

import { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, routing, localesConfig } from '@/i18n/routing'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';
import { Languages } from 'lucide-react';
import Loading from '../common/loading';

const SWITCHING_MESSAGES: Record<string, string> = {
  hi: "हिंदी में परिवर्तन किया जा रहा है",
  bn: "বাংলায় পরিবর্তন করা হচ্ছে",
  en: "Switching to English",
  es: "Cambiando al español",
};

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [loadingMessage, setLoadingMessage] = useState(""); 
  const localActive = useLocale();
  const pathname = usePathname(); 

  const onSelectChange = (nextLocale: string) => {
    const customMsg = SWITCHING_MESSAGES[nextLocale] || `Switching to ${nextLocale}...`;
    setLoadingMessage(customMsg);

    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      setTimeout(() => {
        window.location.href = `/${nextLocale}${pathname}`;
      }, 500); 
    });
  };

  const currentLocaleInfo = localesConfig[localActive as keyof typeof localesConfig];

  return (
    <>
      {(isPending || !!loadingMessage) && (
        <Loading message={loadingMessage} />
      )}

      <Select 
        value={localActive} 
        onValueChange={onSelectChange} 
        disabled={isPending || !!loadingMessage}
      >
        <SelectTrigger className="w-auto min-w-10 bg-transparent hover:border-0 px-2 text-amber-950/50 dark:text-amber-800 focus:ring-0 focus:ring-offset-0 border-none outline-none">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline lg:hidden text-sm font-semibold uppercase">
                {currentLocaleInfo?.label ?? localActive}
              </span>
              <span className="hidden lg:inline text-sm font-medium">
                {currentLocaleInfo?.label}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {routing.locales.map((locale) => {
            const info = localesConfig[locale as keyof typeof localesConfig];
            return (
              <SelectItem key={locale} value={locale}>
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${info.country}.svg`}
                    alt={info.label}
                    className="w-6 h-4 object-cover shadow-sm"
                    width={24}
                    height={16}
                  />
                  <span className="text-sm font-medium">{info.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}