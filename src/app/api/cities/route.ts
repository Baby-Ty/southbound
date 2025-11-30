import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders, handleOptions } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  // Always return success - return empty array if there's any issue
  try {
    // Dynamic import to avoid module initialization errors
    const { getAllCities } = await import('@/lib/cosmos-cities');
    const { RegionKey } = await import('@/lib/cityPresets');
    
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') as RegionKey | null;

    console.log('[API] Fetching cities, region:', region);
    console.log('[API] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    // getAllCities handles errors and returns empty array on failure
    const cities = await getAllCities(region || undefined);
    
    console.log('[API] Success: Returning', cities.length, 'cities');
    
    return NextResponse.json({ cities }, { headers: corsHeaders });
  } catch (error: any) {
    // Catch any unexpected errors and return empty array
    console.error('[API] Unexpected error:', error);
    console.error('[API] Error message:', error?.message);
    console.error('[API] Error code:', error?.code);
    console.error('[API] Error statusCode:', error?.statusCode);
    console.error('[API] Error stack:', error?.stack?.substring(0, 500));
    
    // Always return success with empty array
    return NextResponse.json({ cities: [] }, { headers: corsHeaders });
  }
}

