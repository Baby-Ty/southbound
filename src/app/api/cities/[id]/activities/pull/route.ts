import { NextRequest, NextResponse } from 'next/server';
import {
  getCity,
  updateCityActivities,
} from '@/lib/cosmos-cities';
import { tripAdvisorClient } from '@/lib/tripadvisor';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * POST /api/cities/[id]/activities/pull
 * Pull activities from TripAdvisor for a city
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { limit = 30, replace = false, offset = 0, page = 1, itemsPerPage = 30 } = body;

    // Check if TripAdvisor API key is configured
    if (!process.env.TRIPADVISOR_API_KEY) {
      return NextResponse.json(
        { error: 'TRIPADVISOR_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Get the city
    const city = await getCity(id);
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Search for attractions using TripAdvisor
    const searchQuery = `${city.city}, ${city.country || ''}`;
    console.log(`[Pull Activities] Fetching page ${page} for: ${searchQuery}`);

    // For multi-page fetching, we fetch a larger batch and paginate through it
    // TripAdvisor API doesn't support native pagination, so we fetch up to 100 and paginate client-side
    const batchSize = 100; // Fetch larger batch to enable pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    let newActivities;
    try {
      // Fetch a larger batch (up to 100 activities)
      const allActivities = await tripAdvisorClient.searchCityAttractions(
        city.city,
        city.country || '',
        { limit: batchSize }
      );
      console.log(`[Pull Activities] Found ${allActivities.length} total activities from TripAdvisor`);
      
      // Extract the page we need
      newActivities = allActivities.slice(startIndex, endIndex);
      console.log(`[Pull Activities] Page ${page}: showing activities ${startIndex + 1}-${Math.min(endIndex, allActivities.length)} of ${allActivities.length}`);
      
      // If we're requesting a page beyond what's available, return empty
      if (newActivities.length === 0) {
        return NextResponse.json({
          activities: city.tripAdvisorActivities || [],
          count: city.tripAdvisorActivities?.length || 0,
          total: allActivities.length,
          page: page,
          itemsPerPage: itemsPerPage,
          message: `Page ${page} is beyond available results (${allActivities.length} total activities)`,
        });
      }
    } catch (tripAdvisorError: any) {
      console.error('[Pull Activities] TripAdvisor API error:', tripAdvisorError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch from TripAdvisor API',
          details: tripAdvisorError.message 
        },
        { status: 500 }
      );
    }

    // Merge with existing activities or replace
    let updatedActivities = newActivities;
    if (!replace && city.tripAdvisorActivities && city.tripAdvisorActivities.length > 0) {
      // Merge: keep existing activities, add new ones that don't exist
      const existingLocationIds = new Set(
        city.tripAdvisorActivities.map((a) => a.locationId)
      );
      const newUniqueActivities = newActivities.filter(
        (a) => !existingLocationIds.has(a.locationId)
      );
      updatedActivities = [...city.tripAdvisorActivities, ...newUniqueActivities];
    }

    // Update the city in Cosmos DB
    await updateCityActivities(id, updatedActivities);

    return NextResponse.json({
      activities: updatedActivities,
      count: updatedActivities.length,
      total: replace ? updatedActivities.length : (city.tripAdvisorActivities?.length || 0) + newActivities.length,
      page: page || 1,
      itemsPerPage: itemsPerPage || limit,
    });
  } catch (error: any) {
    console.error('[Pull Activities] Error:', error);
    console.error('[Pull Activities] Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to pull activities',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

