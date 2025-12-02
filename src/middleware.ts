import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // If accessing hub.southbnd.co.za, only allow /hub/* routes
  if (hostname.includes('hub.southbnd.co.za') || hostname.includes('hub')) {
    const pathname = request.nextUrl.pathname;
    
    // Allow hub routes and static assets
    if (
      pathname.startsWith('/hub') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/favicon') ||
      pathname === '/'
    ) {
      // If root path on hub domain, redirect to /hub
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/hub', request.url));
      }
      return NextResponse.next();
    }
    
    // Redirect everything else to hub home
    return NextResponse.redirect(new URL('/hub', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

