import { NextRequest, NextResponse } from 'next/server';
import { getAllCities } from '@/lib/cosmos-cities';

/**
 * Next.js API route for fetching cities
 * Calls CosmosDB directly, optionally filtered by region
 */

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region') || undefined;

    console.log('[API /api/cities] Fetching cities, region:', region);
    console.log('[API /api/cities] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/cities] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    const cities = await getAllCities(region);
    
    console.log('[API /api/cities] Success: Returning', cities.length, 'cities');
    
    return NextResponse.json({ cities });
  } catch (error: any) {
    console.error('[API /api/cities] Unexpected error:', error);
    // Return empty array instead of error to allow UI to continue working
    return NextResponse.json({ cities: [] });
  }
}
