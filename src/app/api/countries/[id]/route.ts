import { NextRequest, NextResponse } from 'next/server';
import { getCountry, updateCountry, deleteCountry } from '@/lib/cosmos-countries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const country = await getCountry(id);
    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ country });
  } catch (error: any) {
    console.error('[API /countries/[id]] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch country' },
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
    const country = await updateCountry(id, body);
    return NextResponse.json({ country });
  } catch (error: any) {
    console.error('[API /countries/[id]] Error updating country:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update country' },
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
    await deleteCountry(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /countries/[id]] Error deleting country:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete country' },
      { status: 500 }
    );
  }
}
