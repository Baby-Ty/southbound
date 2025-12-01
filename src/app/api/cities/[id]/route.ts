import { NextRequest, NextResponse } from 'next/server';
import { getCity, updateCity, deleteCity } from '@/lib/cosmos-cities';

/**
 * Next.js API route that proxies to Azure Functions or calls CosmosDB directly
 * This provides a fallback if Azure Functions isn't working
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 });
    }

    // Try to get city from CosmosDB directly
    const city = await getCity(id);
    
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ city });
  } catch (error: any) {
    console.error('[API /api/cities/[id]] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch city' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    // Update city in CosmosDB directly
    const city = await updateCity(id, body);
    
    return NextResponse.json({ city });
  } catch (error: any) {
    console.error('[API /api/cities/[id]] Error updating city:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update city' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 });
    }

    await deleteCity(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /api/cities/[id]] Error deleting city:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete city' },
      { status: 500 }
    );
  }
}
