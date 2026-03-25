import { NextRequest, NextResponse } from 'next/server';
import { getTripTemplateById, updateTripTemplate, deleteTripTemplate } from '@/lib/cosmos';

export const dynamic = 'force-dynamic';

const VALID_REGIONS = ['europe', 'latin-america', 'southeast-asia'] as const;
type Region = typeof VALID_REGIONS[number];

/**
 * GET /api/trip-templates/[id]?region=<region>
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const region = request.nextUrl.searchParams.get('region') as Region | null;
    if (!region || !VALID_REGIONS.includes(region)) {
      return NextResponse.json({ error: 'Valid region parameter required' }, { status: 400 });
    }
    const template = await getTripTemplateById(params.id, region);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ template });
  } catch (error: any) {
    console.error('[API /trip-templates/[id] GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch template' }, { status: 500 });
  }
}

/**
 * PATCH /api/trip-templates/[id]?region=<region>
 * Body: Partial<TripTemplate> fields to update
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const region = request.nextUrl.searchParams.get('region') as Region | null;
    if (!region || !VALID_REGIONS.includes(region)) {
      return NextResponse.json({ error: 'Valid region parameter required' }, { status: 400 });
    }
    const updates = await request.json();
    // Strip immutable fields from the update payload
    const { id: _id, region: _region, createdAt: _createdAt, ...safeUpdates } = updates;
    const template = await updateTripTemplate(params.id, region, safeUpdates);
    return NextResponse.json({ template });
  } catch (error: any) {
    console.error('[API /trip-templates/[id] PATCH] Error:', error);
    if (error.message?.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update template' }, { status: 500 });
  }
}

/**
 * DELETE /api/trip-templates/[id]?region=<region>
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const region = request.nextUrl.searchParams.get('region') as Region | null;
    if (!region || !VALID_REGIONS.includes(region)) {
      return NextResponse.json({ error: 'Valid region parameter required' }, { status: 400 });
    }
    await deleteTripTemplate(params.id, region);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /trip-templates/[id] DELETE] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete template' }, { status: 500 });
  }
}
