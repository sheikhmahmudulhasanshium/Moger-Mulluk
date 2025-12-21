'use client';

import { useLocale } from 'next-intl';
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
import { Languages } from 'lucide-react';

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

  const currentLocaleInfo =
    localesConfig[localActive as keyof typeof localesConfig];

  return (
    <Select 
      value={localActive} 
      onValueChange={onSelectChange} 
      disabled={isPending}
    >
      <SelectTrigger className="w-auto min-w-10 bg-transparent hover:border-0 px-2 text-amber-950/50">
        <SelectValue placeholder="Select Language">
          <div className="flex items-center gap-2">
            {/* xs / sm → icon */}
            <Languages className="h-4 w-4 md:hidden text-amber-950/50" />

            {/* md → language code */}
            <span className="hidden md:inline lg:hidden text-sm font-semibold uppercase">
              {currentLocaleInfo?.label ?? localActive}
            </span>

            {/* lg+ → full name */}
            <span className="hidden lg:inline text-sm font-medium">
              {currentLocaleInfo?.label}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      
      {/* 🔒 CONTENT UNCHANGED */}
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
                  width={100}
                  height={100}
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
