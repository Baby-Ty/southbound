import { NextRequest, NextResponse } from 'next/server';
import {
  deleteDefaultTrip,
  getDefaultTripById,
  updateDefaultTrip,
} from '@/lib/cosmos-default-trips';

// Required for static export - tells Next.js this route is dynamic and should be skipped
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trip = await getDefaultTripById(id);
    if (!trip) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ trip });
  } catch (error: any) {
    console.error('[API /default-trips/:id] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch default trip' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Never allow callers to change partition key / immutable fields.
    // (Region is the Cosmos partition key for defaultTrips.)
    const { id: _id, region: _region, createdAt: _createdAt, updatedAt: _updatedAt, ...updates } =
      (body || {}) as any;
    const trip = await updateDefaultTrip(id, updates);
    return NextResponse.json({ trip });
  } catch (error: any) {
    console.error('[API /default-trips/:id] Error updating:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update default trip' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDefaultTrip(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /default-trips/:id] Error deleting:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete default trip' },
      { status: 500 }
    );
  }
}

