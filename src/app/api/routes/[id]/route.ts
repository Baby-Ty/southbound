import { NextRequest, NextResponse } from 'next/server';
import { getRoute, updateRoute, deleteRoute, SavedRoute } from '@/lib/cosmos';
import * as fallback from '@/lib/cosmos-fallback';

export const dynamic = 'force-dynamic';

// Check if CosmosDB is configured
function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let route: SavedRoute | null = null;

    if (isCosmosDBConfigured()) {
      try {
        route = await getRoute(id);
      } catch (cosmosError: any) {
        console.warn('CosmosDB get failed, using fallback:', cosmosError.message);
        route = await fallback.getRouteFallback(id);
      }
    } else {
      route = await fallback.getRouteFallback(id);
    }
    
    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ route });
  } catch (error: any) {
    console.error('Error fetching route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch route' },
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
    
    // Only allow updating specific fields
    const allowedUpdates: Partial<SavedRoute> = {};
    
    if (body.status !== undefined) {
      allowedUpdates.status = body.status;
    }
    if (body.stops !== undefined) {
      allowedUpdates.stops = body.stops;
    }
    if (body.preferences !== undefined) {
      allowedUpdates.preferences = body.preferences;
    }
    if (body.notes !== undefined) {
      allowedUpdates.notes = body.notes;
    }
    if (body.adminNotes !== undefined) {
      allowedUpdates.adminNotes = body.adminNotes;
    }

    let route: SavedRoute;

    if (isCosmosDBConfigured()) {
      try {
        route = await updateRoute(id, allowedUpdates);
      } catch (cosmosError: any) {
        console.warn('CosmosDB update failed, using fallback:', cosmosError.message);
        route = await fallback.updateRouteFallback(id, allowedUpdates);
      }
    } else {
      route = await fallback.updateRouteFallback(id, allowedUpdates);
    }
    
    return NextResponse.json({ route });
  } catch (error: any) {
    console.error('Error updating route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update route' },
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
    if (isCosmosDBConfigured()) {
      try {
        await deleteRoute(id);
      } catch (cosmosError: any) {
        console.warn('CosmosDB delete failed, using fallback:', cosmosError.message);
        await fallback.deleteRouteFallback(id);
      }
    } else {
      await fallback.deleteRouteFallback(id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete route' },
      { status: 500 }
    );
  }
}

