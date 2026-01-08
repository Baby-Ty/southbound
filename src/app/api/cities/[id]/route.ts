import { NextRequest, NextResponse } from 'next/server';
import { getCity, updateCity, deleteCity } from '@/lib/cosmos-cities';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const city = await getCity(id);
    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ city });
  } catch (error: any) {
    console.error('[API /cities/[id]] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch city' },
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
    const city = await updateCity(id, body);
    return NextResponse.json({ city });
  } catch (error: any) {
    console.error('[API /cities/[id]] Error updating city:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update city' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCity(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /cities/[id]] Error deleting city:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete city' },
      { status: 500 }
    );
  }
}
