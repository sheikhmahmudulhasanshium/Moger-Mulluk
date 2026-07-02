import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // 1. Match the root
    '/',
    // 2. EXCLUDE everything that shouldn't be localized
    // Added sitemap.xml and final-sitemap.xml here
    '/((?!api|_next|_vercel|sitemap\\.xml|final-sitemap\\.xml|robots\\.txt|favicon|logo|.*\\..*).*)'
  ]
};