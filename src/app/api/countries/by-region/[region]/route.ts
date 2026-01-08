import { NextRequest, NextResponse } from 'next/server';
import { getAllCountries } from '@/lib/cosmos-countries';
import { RegionKey } from '@/lib/cityPresets';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  try {
    const { region } = await params;
    const regionKey = region as RegionKey;
    const countries = await getAllCountries(regionKey);
    return NextResponse.json({ countries });
  } catch (error: any) {
    console.error('[API /countries/by-region/[region]] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
