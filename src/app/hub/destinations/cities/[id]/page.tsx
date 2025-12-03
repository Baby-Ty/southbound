// Server component wrapper with generateStaticParams for static export
import CityFormClient from '../CityFormClient';

// Required for static export - tells Next.js which routes to pre-generate
// Fetches all city IDs from the API at build time
export async function generateStaticParams() {
  try {
    // Use the production API URL at build time
    const apiBase = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'https://api.southbnd.co.za';
    const response = await fetch(`${apiBase}/api/cities`);
    
    if (!response.ok) {
      console.warn('[generateStaticParams cities] Failed to fetch cities:', response.status);
      return [];
    }
    
    const data = await response.json();
    const cities = data.cities || [];
    
    console.log(`[generateStaticParams cities] Found ${cities.length} cities to pre-generate`);
    
    // Return array of { id: string } for each city
    return cities.map((city: { id: string }) => ({
      id: city.id,
    }));
  } catch (error) {
    console.error('[generateStaticParams cities] Error fetching cities:', error);
    // Return empty array on error - build will succeed but city pages won't be pre-generated
    return [];
  }
}

export default function EditCityPage() {
  return <CityFormClient mode="edit" />;
}

