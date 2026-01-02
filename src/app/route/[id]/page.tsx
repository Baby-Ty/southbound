// Server component wrapper that exports generateStaticParams for static export
import RouteViewClient from './RouteViewClient';

// Helper function for fetch with timeout
async function fetchWithTimeout(url: string, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Required for static export - tells Next.js which routes to pre-generate
// Fetches all route IDs from the API at build time
export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    // Use the production API URL at build time
    const apiBase = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'https://api.southbnd.co.za';
    
    // Use fetch with timeout to prevent hanging during build
    const response = await fetchWithTimeout(`${apiBase}/api/routes`, 5000);
    
    if (!response.ok) {
      console.warn('[generateStaticParams] Failed to fetch routes:', response.status);
      // Return placeholder to satisfy Next.js static export requirement
      // This ensures the function is recognized even when API fails
      return [{ id: 'placeholder' }];
    }
    
    const data = await response.json();
    const routes = data.routes || [];
    
    console.log(`[generateStaticParams] Found ${routes.length} routes to pre-generate`);
    
    // Return array of { id: string } for each route
    const params = routes.map((route: { id: string }) => ({
      id: route.id,
    }));
    
    // Ensure at least one param is returned (required for static export)
    return params.length > 0 ? params : [{ id: 'placeholder' }];
  } catch (error: any) {
    console.error('[generateStaticParams] Error fetching routes:', error?.message || error);
    // Return placeholder to satisfy Next.js static export requirement
    // This ensures the function is recognized even when API fails
    return [{ id: 'placeholder' }];
  }
}

// Disable dynamic params - only routes returned by generateStaticParams will be available
export const dynamicParams = false;

export default function RouteViewPage() {
  return <RouteViewClient />;
}
