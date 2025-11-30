import { NextRequest, NextResponse } from 'next/server';
import { getCityByName, CityData } from '@/lib/cosmos-cities';
import { RegionKey } from '@/lib/cityPresets';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get('city');
    const region = searchParams.get('region') as RegionKey | null;

    if (!cityName || !region) {
      return NextResponse.json(
        { error: 'Missing city name or region' },
        { status: 400 }
      );
    }

    const city = await getCityByName(cityName, region);
    
    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ city });
  } catch (error: any) {
    console.error('Error fetching city by name:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch city' },
      { status: 500 }
    );
  }
}

