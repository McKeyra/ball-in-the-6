import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'b6_access_token';

/** Routes that don't require authentication */
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/welcome',
  '/about',
  '/onboarding',
  '/get-started',
  '/forgot-password',
  '/terms',
  '/privacy',
  '/api/auth',
  '/api/health',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.svg' ||
    pathname === '/manifest.json' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  );
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Inject token as header for API routes to read
  if (token) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-token', token);

    // If authenticated user hits login/register, redirect to home
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // No token — allow public paths, redirect everything else to login
  if (isPublicPath(pathname) || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Unauthenticated user on protected page → redirect to login
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|sitemap.xml|robots.txt|manifest.json|icons).*)',
  ],
};
