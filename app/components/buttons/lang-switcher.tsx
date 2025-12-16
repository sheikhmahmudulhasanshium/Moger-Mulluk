'use client';

import { useLocale } from 'next-intl';
// 👇 Import the Master Config
import { usePathname, routing, localesConfig } from '../../../i18n/routing'; 
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const localActive = useLocale();
  const pathname = usePathname(); 

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.href = `/${nextLocale}${pathname}`;
    });
  };

  // Helper to get type-safe config
  // We cast 'localActive' because we know it exists in our config
  const currentLocaleInfo = localesConfig[localActive as keyof typeof localesConfig];

  return (
    <Select 
      value={localActive} 
      onValueChange={onSelectChange} 
      disabled={isPending}
    >
      <SelectTrigger className="w-40 sm:w-26 bg-transparent border-slate-300 dark:border-slate-700">
        <SelectValue placeholder="Select Language">
           {/* Show Label in Trigger (Optional) */}
           {currentLocaleInfo?.label}
        </SelectValue>
      </SelectTrigger>
      
      <SelectContent>
        {routing.locales.map((locale) => {
          // Access the Master Config directly
          const info = localesConfig[locale as keyof typeof localesConfig];

          return (
            <SelectItem key={locale} value={locale}>
              <div className="flex items-center gap-3">
                <Image
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${info.country}.svg`}
                  alt={info.label}
                  className="w-6 h-4 object-cover shadow-sm" width={100} height={100}
                />
                <span className="text-sm font-medium">{info.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}