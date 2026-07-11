// File: proxy.ts

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
    // --- CRITICAL FIXES START HERE ---
    // Explicitly match exact system files meant for the root
    // These must come BEFORE the general regex to ensure they are skipped.
    '/sitemap.xml',
    '/robots.txt',
    
    // Keep the DevTools exception
    '/.well-known/appspecific/com.chrome.devtools.json',
    // --- CRITICAL FIXES END HERE ---

    // The general exclusion regex:
    // (?!...) means "do NOT match if the path starts with these"
    // We exclude api, _next, static folders, and files with extensions (e.g., .png)
    '/((?!api|_next|_vercel|favicon|logo|.*\\..*).*)'
  ]
};