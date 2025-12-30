import CountryFormClient from '@/components/hub/CountryFormClient';
import { getAllCountries } from '@/lib/cosmos-countries';

// Required for static export - tells Next.js which routes to pre-generate
// Fetches all country IDs from CosmosDB at build time
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Check if CosmosDB is configured
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    console.warn('[generateStaticParams countries] CosmosDB not configured. Returning placeholder.');
    console.warn('[generateStaticParams countries] Set COSMOSDB_ENDPOINT and COSMOSDB_KEY environment variables.');
    // Return placeholder to satisfy Next.js static export requirement
    return [{ id: 'placeholder' }];
  }

  try {
    // Try to fetch countries directly from CosmosDB (server-side)
    const countries = await getAllCountries();
    
    console.log(`[generateStaticParams countries] Found ${countries.length} countries to pre-generate`);
    
    // Return array of { id: string } for each country
    const params = countries.map((country) => ({
      id: country.id,
    }));
    
    // Ensure at least one param is returned (required for static export)
    if (params.length === 0) {
      console.warn('[generateStaticParams countries] No countries found in CosmosDB. Returning placeholder.');
      return [{ id: 'placeholder' }];
    }
    
    console.log(`[generateStaticParams countries] Generated ${params.length} static params`);
    return params;
  } catch (error: any) {
    console.error('[generateStaticParams countries] Error fetching countries:', error);
    console.error('[generateStaticParams countries] Error details:', {
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

export default function EditCountryPage() {
  return <CountryFormClient mode="edit" />;
}
