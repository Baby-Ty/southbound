// Server component wrapper that exports generateStaticParams for static export
import RouteDetailClient from './RouteDetailClient';

// Required for static export - tells Next.js which routes to pre-generate
// Fetches all route IDs from the API at build time
export async function generateStaticParams() {
  try {
    // Use the production API URL at build time
    const apiBase = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'https://api.southbnd.co.za';
    const response = await fetch(`${apiBase}/api/routes`);
    
    if (!response.ok) {
      console.warn('[generateStaticParams] Failed to fetch routes:', response.status);
      return [];
    }
    
    const data = await response.json();
    const routes = data.routes || [];
    
    console.log(`[generateStaticParams] Found ${routes.length} routes to pre-generate`);
    
    // Return array of { id: string } for each route
    return routes.map((route: { id: string }) => ({
      id: route.id,
    }));
  } catch (error) {
    console.error('[generateStaticParams] Error fetching routes:', error);
    // Return empty array on error - build will succeed but route pages won't be pre-generated
    return [];
  }
}

export default function RouteDetailPage() {
  return <RouteDetailClient />;
}
