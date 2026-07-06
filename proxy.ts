import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // 1. Intercept the Chrome DevTools request
  if (request.nextUrl.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  // 2. Run next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Enable for the root
    '/',
    
    // Enable for DevTools
    '/.well-known/appspecific/com.chrome.devtools.json',

    // EXCLUSION LIST:
    // (?!...) means "do NOT match if the path starts with these"
    // We exclude api, _next, static folders (favicon, logo), and files with extensions
    '/((?!api|_next|_vercel|sitemap\\.xml|final-sitemap\\.xml|robots\\.txt|favicon|logo|.*\\..*).*)'
  ]
};