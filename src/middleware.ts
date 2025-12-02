import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // Check if this is the hub subdomain (more specific check)
  const isHubDomain = hostname === 'hub.southbnd.co.za' || 
                      hostname.startsWith('hub.') ||
                      hostname.includes('.hub.') ||
                      (hostname.includes('hub') && hostname.includes('southbnd'));
  
  if (isHubDomain) {
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
        const response = NextResponse.redirect(new URL('/hub', request.url));
        // Add cache-busting headers
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        return response;
      }
      const response = NextResponse.next();
      // Add cache-busting headers for hub routes
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      return response;
    }
    
    // Redirect everything else to hub home
    const response = NextResponse.redirect(new URL('/hub', request.url));
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  }
  
  // For non-hub domains, add cache-busting headers to route-builder
  if (pathname.startsWith('/route-builder')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
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

