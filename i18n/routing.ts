import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

// 1. MASTER CONFIGURATION
// This is your Single Source of Truth. Add new languages here.
export const localesConfig = {
  en: { label: "English", country: "US" },
  bn: { label: "বাংলা", country: "BD" },
  es: { label: "Español", country: "ES" },
  //ar: { label: "العربية", country: "SA"},
  hi: { label: "हिन्दी", country: "IN" },
  //fr: { label: "Français", country: "FR" },
  //fa: { label: "فارسی", country: "IR"},
  //de: { label: "Deutsch", country: "DE" },
  //ja: { label: "日本語", country: "JP" },
  //ru: { label: "Русский", country: "RU" },
 // zh: { label: "中文", country: "CN" },
} as const;

// 2. Extract the list of codes ['en', 'bn', 'es'] automatically
export const routing = defineRouting({
  locales: Object.keys(localesConfig), 
  defaultLocale: 'en'
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);