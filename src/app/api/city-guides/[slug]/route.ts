import { NextRequest, NextResponse } from 'next/server';
import { getCityGuide, saveCityGuide } from '@/lib/cosmos-city-guides';
import { getCityBySlug } from '@/data/cities';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const staticCity = getCityBySlug(slug);
  if (!staticCity) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  let override = null;
  try {
    override = await getCityGuide(slug);
  } catch {
    // CosmosDB not configured — return static data
  }

  const guide = override ? { ...staticCity, ...override } : staticCity;
  return NextResponse.json({ guide, hasOverride: !!override });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const staticCity = getCityBySlug(slug);
  if (!staticCity) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    // Merge static base with incoming partial update, always preserve slug
    const saved = await saveCityGuide(slug, { ...staticCity, ...body, slug });
    return NextResponse.json({ guide: saved });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save city guide' },
      { status: 500 }
    );
  }
}
