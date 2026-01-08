import { NextRequest, NextResponse } from 'next/server';
import { tripAdvisorClient } from '@/lib/tripadvisor';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * GET /api/tripadvisor/location/[locationId]/photos
 * 
 * Fetch photos for a TripAdvisor location
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

    // Fetch photos
    const photos = await tripAdvisorClient.getLocationPhotos(locationId, {
      limit: 20,
    });

    return NextResponse.json({ photos });
  } catch (error: any) {
    console.error('[TripAdvisor Photos] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch photos',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

