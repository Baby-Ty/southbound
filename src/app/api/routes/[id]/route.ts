import { NextRequest, NextResponse } from 'next/server';
import { getRoute, updateRoute, SavedRoute } from '@/lib/cosmos';

/**
 * Next.js API route for individual routes
 * GET: Get a single route by ID
 * PATCH: Update a route
 */

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await context.params;

    console.log('[API /api/routes/[id]] Fetching route', routeId);
    console.log('[API /api/routes/[id]] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/routes/[id]] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    const route = await getRoute(routeId);
    
    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }
    
    console.log('[API /api/routes/[id]] Success: Returning route', routeId);
    
    return NextResponse.json({ route });
  } catch (error: any) {
    console.error('[API /api/routes/[id]] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch route' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await context.params;
    const body = await request.json();

    console.log('[API /api/routes/[id]] Updating route', routeId, body);
    console.log('[API /api/routes/[id]] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/routes/[id]] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    // Only allow updating specific fields
    const allowedUpdates: Partial<SavedRoute> = {};
    if (body.status !== undefined) allowedUpdates.status = body.status;
    if (body.adminNotes !== undefined) allowedUpdates.adminNotes = body.adminNotes;
    if (body.notes !== undefined) allowedUpdates.notes = body.notes;
    if (body.stops !== undefined) allowedUpdates.stops = body.stops;
    if (body.preferences !== undefined) allowedUpdates.preferences = body.preferences;

    const route = await updateRoute(routeId, allowedUpdates);
    
    console.log('[API /api/routes/[id]] Success: Updated route', routeId);
    
    return NextResponse.json({ route });
  } catch (error: any) {
    console.error('[API /api/routes/[id]] Error:', error);
    
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update route' },
      { status: 500 }
    );
  }
}

