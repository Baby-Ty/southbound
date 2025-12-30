// Server component wrapper with generateStaticParams for static export
import CityFormClient from '../CityFormClient';
import { getAllCities } from '@/lib/cosmos-cities';

// Required for static export - tells Next.js which routes to pre-generate
// Fetches all city IDs from CosmosDB at build time
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Check if CosmosDB is configured
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    console.warn('[generateStaticParams cities] CosmosDB not configured. Returning placeholder.');
    console.warn('[generateStaticParams cities] Set COSMOSDB_ENDPOINT and COSMOSDB_KEY environment variables.');
    // Return placeholder to satisfy Next.js static export requirement
    return [{ id: 'placeholder' }];
  }

  try {
    // Try to fetch cities directly from CosmosDB (server-side)
    const cities = await getAllCities();
    
    console.log(`[generateStaticParams cities] Found ${cities.length} cities to pre-generate`);
    
    // Return array of { id: string } for each city
    const params = cities.map((city) => ({
      id: city.id,
    }));
    
    // Ensure at least one param is returned (required for static export)
    if (params.length === 0) {
      console.warn('[generateStaticParams cities] No cities found in CosmosDB. Returning placeholder.');
      return [{ id: 'placeholder' }];
    }
    
    console.log(`[generateStaticParams cities] Generated ${params.length} static params`);
    return params;
  } catch (error: any) {
    console.error('[generateStaticParams cities] Error fetching cities:', error);
    console.error('[generateStaticParams cities] Error details:', {
      message: error.message,
      code: error.code,
      endpoint: endpoint ? 'SET' : 'NOT SET',
      key: key ? 'SET' : 'NOT SET',
    });
    
    // Return placeholder to satisfy Next.js static export requirement
    return [{ id: 'placeholder' }];
  }
}

// Disable dynamic params - only routes returned by generateStaticParams will be available
export const dynamicParams = false;

export default function EditCityPage() {
  return <CityFormClient mode="edit" />;
}

