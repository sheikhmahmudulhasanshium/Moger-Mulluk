import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Match all pathnames except for:
    // 1. /api, /_next, /_vercel
    // 2. /logo, /favicon (your static asset folders)
    // 3. Files with dots (favicon.ico, logo.svg, etc.)
    '/((?!api|_next|_vercel|logo|favicon|.*\\..*).*)'
  ]
};