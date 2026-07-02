import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // 1. Match the root
    '/',
    // 2. Match all localized paths, but EXCLUDE static files and the sitemap
    // Added 'sitemap.xml' to the exclusion list just in case
    '/((?!api|_next|_vercel|final-sitemap\\.xml|sitemap\\.xml|robots\\.txt|logo|favicon|.*\\..*).*)'
  ]
};