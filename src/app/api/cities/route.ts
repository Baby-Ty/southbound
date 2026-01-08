import { NextRequest, NextResponse } from 'next/server';
import { getAllCities, saveCity, CityData } from '@/lib/cosmos-cities';
import { RegionKey } from '@/lib/cityPresets';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region') as RegionKey | null;
    const country = searchParams.get('country');
    const isDetour = searchParams.get('isDetour');
    const mainCities = searchParams.get('mainCities');

    let cities = await getAllCities(region || undefined);

    // Apply filters
    if (country) {
      cities = cities.filter(c => c.country === country);
    }

    if (isDetour === 'true') {
      cities = cities.filter(c => c.isDetour === true);
    } else if (mainCities === 'true') {
      cities = cities.filter(c => c.isDetour !== true);
    }

    return NextResponse.json({ cities });
  } catch (error: any) {
    console.error('[API /cities] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const city = await saveCity(body as Omit<CityData, 'id' | 'createdAt' | 'updatedAt'>);
    return NextResponse.json({ city }, { status: 201 });
  } catch (error: any) {
    console.error('[API /cities] Error creating city:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create city' },
      { status: 500 }
    );
  }
}
