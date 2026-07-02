import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set the regex to ignore ALL sitemap variants and robots.txt
    // Added sitemap.xml and final-sitemap.xml explicitly here
    '/((?!api|_next|_vercel|sitemap\\.xml|final-sitemap\\.xml|robots\\.txt|logo|favicon|.*\\..*).*)'
  ]
};