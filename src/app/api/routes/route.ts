import { NextRequest, NextResponse } from 'next/server';
import { saveRoute, getAllRoutes, SavedRoute } from '@/lib/cosmos';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, region, stops, preferences, notes } = body;

    // Validation
    if (!name || !email || !region || !stops || !preferences) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, region, stops, preferences' },
        { status: 400 }
      );
    }

    // Validate name
    if (!name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate email format (allow @whatsapp suffix)
    const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    let route: SavedRoute;
    
    // Try CosmosDB first, fallback to localStorage if not configured
    if (isCosmosDBConfigured()) {
      try {
        route = await saveRoute({
          name: name.trim(),
          email,
          region,
          stops,
          preferences,
          status: 'draft',
          notes: notes || '',
        });
      } catch (cosmosError: any) {
        console.warn('CosmosDB save failed, using fallback:', cosmosError.message);
        // Fallback to localStorage
        route = await fallback.saveRouteFallback({
          name: name.trim(),
          email,
          region,
          stops,
          preferences,
          status: 'draft',
          notes: notes || '',
        });
      }
    } else {
      // Use fallback storage
      console.warn('CosmosDB not configured, using fallback storage');
      route = await fallback.saveRouteFallback({
        name: name.trim(),
        email,
        region,
        stops,
        preferences,
        status: 'draft',
        notes: notes || '',
      });
    }

    return NextResponse.json({ route }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving route:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to save route';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as SavedRoute['status'] | null;
    const email = searchParams.get('email');
    const region = searchParams.get('region');

    const filters = {
      ...(status && { status }),
      ...(email && { email }),
      ...(region && { region }),
    };

    let routes: SavedRoute[];

    // Try CosmosDB first, fallback to localStorage if not configured
    if (isCosmosDBConfigured()) {
      try {
        routes = await getAllRoutes(filters);
      } catch (cosmosError: any) {
        console.warn('CosmosDB fetch failed, using fallback:', cosmosError.message);
        routes = await fallback.getAllRoutesFallback(filters);
      }
    } else {
      routes = await fallback.getAllRoutesFallback(filters);
    }

    return NextResponse.json({ routes });
  } catch (error: any) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}

