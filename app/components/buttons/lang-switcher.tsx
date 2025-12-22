'use client';

import { useState, useTransition } from 'react'; // Added useState
import { useLocale } from 'next-intl';
import { usePathname, routing, localesConfig } from '../../../i18n/routing'; 
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

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [isManualLoading, setIsManualLoading] = useState(false); // Track the artificial delay
  const localActive = useLocale();
  const pathname = usePathname(); 

  const onSelectChange = (nextLocale: string) => {
    // 1. Show the loader immediately
    setIsManualLoading(true);

    startTransition(() => {
      // 2. Set the cookie immediately
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      
      // 3. Wait for 1.5 seconds before triggering the page reload
      setTimeout(() => {
        window.location.href = `/${nextLocale}${pathname}`;
      }, 500); // 1500ms = 1.5 seconds
    });
  };

  const currentLocaleInfo =
    localesConfig[localActive as keyof typeof localesConfig];

  return (
    <>
      {/* Show loader if transition is starting OR if we are in our 1.5s delay */}
      {(isPending || isManualLoading) && <Loading />}

      <Select 
        value={localActive} 
        onValueChange={onSelectChange} 
        disabled={isPending || isManualLoading}
      >
        <SelectTrigger className="w-auto min-w-10 bg-transparent hover:border-0 px-2 text-amber-950/50 dark:text-amber-800">
          <SelectValue placeholder="Select Language">
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