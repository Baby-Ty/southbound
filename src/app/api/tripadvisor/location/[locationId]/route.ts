import { NextRequest, NextResponse } from 'next/server';
import { tripAdvisorClient } from '@/lib/tripadvisor';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * GET /api/tripadvisor/location/[locationId]
 * 
 * Fetch full location details from TripAdvisor API including description.
 * This endpoint is used when we need more details than what the search API provides.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  try {
    const { locationId } = await params;

    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.TRIPADVISOR_API_KEY) {
      return NextResponse.json(
        { error: 'TripAdvisor API key not configured' },
        { status: 500 }
      );
    }

    console.log(`[TripAdvisor API] Fetching full details for location: ${locationId}`);

    // Fetch full location details
    const location = await tripAdvisorClient.getLocationDetails(locationId);

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Debug: Log available keys to see if we're missing any rich data
    console.log(`[TripAdvisor API] Raw location keys for ${locationId}:`, Object.keys(location));
    if ((location as any).description) {
         console.log(`[TripAdvisor API] Description found (len: ${(location as any).description.length})`);
    } else {
         console.log(`[TripAdvisor API] No description in raw response`);
    }

    // Convert to our activity format with photos
    const activity = await tripAdvisorClient.locationToActivity(location, true);

    console.log(`[TripAdvisor API] Successfully fetched details for: ${activity.name}`);
    console.log(`[TripAdvisor API] Description length: ${activity.description?.length || 0} characters`);

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error('[TripAdvisor API] Error fetching location:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch location details',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

