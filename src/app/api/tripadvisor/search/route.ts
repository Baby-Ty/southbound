import { NextRequest, NextResponse } from 'next/server';
import { tripAdvisorClient } from '@/lib/tripadvisor';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * POST /api/tripadvisor/search
 * Search for attractions in a city using TripAdvisor API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, locationId, cityName, countryName, limit = 20 } = body;

    if (!query && !locationId && !cityName) {
      return NextResponse.json(
        { error: 'Either query, locationId, or cityName is required' },
        { status: 400 }
      );
    }

    // Check if TripAdvisor API key is configured
    if (!process.env.TRIPADVISOR_API_KEY) {
      return NextResponse.json(
        { error: 'TRIPADVISOR_API_KEY is not configured' },
        { status: 500 }
      );
    }

    let results: any[] = [];
    if (locationId) {
      // Search by location ID
      const locationDetails = await tripAdvisorClient.getLocationDetails(locationId);
      if (locationDetails) {
        results = [await tripAdvisorClient.locationToActivity(locationDetails)];
      } else {
        results = [];
      }
    } else if (cityName) {
      // Search by city name (for ActivityPickerModal)
      const searchQuery = countryName 
        ? `things to do ${cityName} ${countryName}` 
        : `things to do ${cityName}`;
      const locations = await tripAdvisorClient.searchLocations(searchQuery, { limit });
      results = await Promise.all(
        locations.map((loc) => tripAdvisorClient.locationToActivity(loc))
      );
    } else {
      // Search by query
      const locations = await tripAdvisorClient.searchLocations(query, { limit });
      results = await Promise.all(
        locations.map((loc) => tripAdvisorClient.locationToActivity(loc))
      );
    }

    // Return in format expected by ActivityPickerModal
    return NextResponse.json({ 
      results,
      activities: results, // Also include as 'activities' for backward compatibility
    });
  } catch (error: any) {
    console.error('[TripAdvisor Search] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search TripAdvisor' },
      { status: 500 }
    );
  }
}

