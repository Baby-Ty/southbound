// Server component wrapper that exports generateStaticParams for static export
import RouteViewClient from './RouteViewClient';

// Required for static export - tells Next.js which routes to pre-generate
// Fetches all route IDs from the API at build time
export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    // Use the production API URL at build time
    const apiBase = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'https://api.southbnd.co.za';
    const response = await fetch(`${apiBase}/api/routes`);
    
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
  } catch (error) {
    console.error('[generateStaticParams] Error fetching routes:', error);
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
