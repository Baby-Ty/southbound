import { NextRequest, NextResponse } from 'next/server';
import { getAllCountries, saveCountry, CountryData } from '@/lib/cosmos-countries';
import { RegionKey } from '@/lib/cityPresets';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region') as RegionKey | null;

    console.log('[API /countries] Fetching countries, region:', region || 'all');
    
    const countries = await getAllCountries(region || undefined);
    
    console.log('[API /countries] Found', countries.length, 'countries');
    
    // Always return success with countries array (empty if none found or CosmosDB not configured)
    // This is valid - might not have any countries yet or CosmosDB might not be set up
    return NextResponse.json({ countries });
  } catch (error: any) {
    console.error('[API /countries] Error:', error);
    console.error('[API /countries] Error details:', {
      message: error.message,
      stack: error.stack?.substring(0, 500),
    });
    
    // If CosmosDB isn't configured or there's a connection issue, return empty array instead of error
    // This allows the UI to work even without CosmosDB configured
    if (error.message?.includes('CosmosDB') || error.message?.includes('not configured') || error.message?.includes('connect')) {
      console.warn('[API /countries] CosmosDB issue detected, returning empty array');
      return NextResponse.json({ countries: [] });
    }
    
    // For other errors, return error response
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch countries',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const country = await saveCountry(body as Omit<CountryData, 'id' | 'createdAt' | 'updatedAt'>);
    return NextResponse.json({ country }, { status: 201 });
  } catch (error: any) {
    console.error('[API /countries] Error creating country:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create country' },
      { status: 500 }
    );
  }
}
