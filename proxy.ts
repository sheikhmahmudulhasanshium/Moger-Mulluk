// File: middleware.ts (REVERTED to original)
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

    // EXCLUSION LIST: Ensure sitemap.xml and robots.txt are INCLUDED here.
    // We need to make sure 'sitemap\\.xml' and 'robots\\.txt' are definitely inside this regex.
    '/((?!api|_next|_vercel|sitemap\\.xml|robots\\.txt|favicon|logo|.*\\..*).*)'
  ]
};