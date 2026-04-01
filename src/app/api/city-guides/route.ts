import { NextResponse } from 'next/server';
import { getAllCityGuides } from '@/lib/cosmos-city-guides';
import { getAllCities } from '@/data/cities';

export async function GET() {
  try {
    const staticCities = getAllCities();

    // Try to load CosmosDB overrides — gracefully degrade if not configured
    let overrides: Record<string, any> = {};
    try {
      const guides = await getAllCityGuides();
      guides.forEach((g) => {
        overrides[g.slug] = g;
      });
    } catch {
      // CosmosDB not configured — static data only
    }

    const merged = staticCities.map((city) => ({
      ...city,
      ...(overrides[city.slug] || {}),
    }));

    return NextResponse.json({ guides: merged });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch city guides' },
      { status: 500 }
    );
  }
}
