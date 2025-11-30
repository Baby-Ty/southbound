import { NextRequest, NextResponse } from 'next/server';
import { getCity, updateCity, deleteCity, CityData } from '@/lib/cosmos-cities';
import { corsHeaders, handleOptions } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('[API] Fetching city with ID:', id);
    
    const city = await getCity(id);
    
    if (!city) {
      console.log('[API] City not found:', id);
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('[API] City found:', city.city, city.country);
    return NextResponse.json({ city }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('[API] Error fetching city:', error);
    console.error('[API] Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch city' },
      { status: 500, headers: corsHeaders }
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
    
    return NextResponse.json({ city }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update city' },
      { status: 500, headers: corsHeaders }
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
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error deleting city:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete city' },
      { status: 500, headers: corsHeaders }
    );
  }
}

