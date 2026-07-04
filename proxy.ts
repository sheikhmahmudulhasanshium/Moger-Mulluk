import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // 1. Intercept the Chrome DevTools request immediately
  if (request.nextUrl.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  // 2. Pass all other requests to next-intl
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    
    // ADDED: Explicitly match the DevTools endpoint so the middleware can intercept it
    '/.well-known/appspecific/com.chrome.devtools.json',

    // Your existing exclusion rule
    '/((?!api|_next|_vercel|sitemap\\.xml|final-sitemap\\.xml|robots\\.txt|favicon|logo|.*\\..*).*)'
  ]
};
