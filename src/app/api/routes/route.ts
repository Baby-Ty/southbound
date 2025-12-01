import { NextRequest, NextResponse } from 'next/server';
import { getAllRoutes, saveRoute } from '@/lib/cosmos';
import { SavedRoute } from '@/lib/cosmos';

/**
 * Next.js API route for routes
 * GET: List all routes (with optional filters)
 * POST: Create a new route
 */

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as SavedRoute['status'] | null;
    const email = searchParams.get('email');
    const region = searchParams.get('region');

    console.log('[API /api/routes] Fetching routes', { status, email, region });
    console.log('[API /api/routes] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/routes] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    const filters: {
      status?: SavedRoute['status'];
      email?: string;
      region?: string;
    } = {};

    if (status) filters.status = status;
    if (email) filters.email = email;
    if (region) filters.region = region;

    const routes = await getAllRoutes(filters);
    
    console.log('[API /api/routes] Success: Returning', routes.length, 'routes');
    
    return NextResponse.json({ routes });
  } catch (error: any) {
    console.error('[API /api/routes] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, region, stops, preferences, notes } = body;

    // Validate required fields
    if (!name || !email || !region || !stops || !preferences) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, region, stops, and preferences are required' },
        { status: 400 }
      );
    }

    console.log('[API /api/routes] Creating route', { name, email, region, stopsCount: stops?.length });
    console.log('[API /api/routes] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/routes] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    const routeData: Omit<SavedRoute, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      email: email.trim(),
      region,
      stops,
      preferences,
      status: 'draft',
      notes: notes || '',
    };

    const route = await saveRoute(routeData);
    
    console.log('[API /api/routes] Success: Created route', route.id);
    
    return NextResponse.json({ route }, { status: 201 });
  } catch (error: any) {
    console.error('[API /api/routes] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save route' },
      { status: 500 }
    );
  }
}

