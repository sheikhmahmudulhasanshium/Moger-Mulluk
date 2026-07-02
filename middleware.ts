import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // 1. Match the root
    '/',

    // 2. EXCLUDE everything that shouldn't be localized.
    // We use a simpler, more aggressive exclusion list here.
    '/((?!api|_next|_vercel|sitemap\\.xml|final-sitemap\\.xml|robots\\.txt|favicon|logo|.*\\..*).*)'
  ]
};