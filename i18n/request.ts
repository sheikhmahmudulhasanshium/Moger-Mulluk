import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // 1. Get the locale requested by the browser/url
  let locale = await requestLocale;

  // 2. If valid, use it. If not, force default.
  // FIX: Cast 'routing.locales' to 'readonly string[]' to fix the TS/ESLint error
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale, 
    messages: (await import(`../messages/${locale}.json`)).default
  };
});