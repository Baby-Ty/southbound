import { NextRequest, NextResponse } from 'next/server';
import { getAllCities } from '@/lib/cosmos-cities';
import { tripAdvisorClient } from '@/lib/tripadvisor';
import { TripAdvisorActivity } from '@/lib/tripadvisor';
import { updateCityActivities } from '@/lib/cosmos-cities';
import { generateActivityDescription } from '@/lib/aiDescriptionGenerator';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * Rate limiting configuration
 * TripAdvisor free tier: ~1000 requests/day
 * We'll be conservative: ~500 requests/day max
 * Per city: 1 search + up to 30 details + up to 30 AI generations = ~61 requests
 * So we can safely process ~8 cities per day with buffer
 */
const RATE_LIMIT_DELAY_MS = 2000; // 2 seconds between API calls
const MAX_CITIES_PER_RUN = 50; // Safety limit per sync run

/**
 * Helper to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Select top 2 activities by rating and review count
 */
function selectTopActivities(activities: TripAdvisorActivity[]): TripAdvisorActivity[] {
  // Sort by rating (descending), then by review count (descending)
  const sorted = [...activities].sort((a, b) => {
    const aScore = (a.rating || 0) * 1000 + (a.reviewCount || 0);
    const bScore = (b.rating || 0) * 1000 + (b.reviewCount || 0);
    return bScore - aScore;
  });
  
  return sorted.slice(0, 2);
}

/**
 * Fetch full details for an activity to get description
 */
async function enrichActivityWithDescription(
  activity: TripAdvisorActivity,
  cityName: string,
  countryName?: string
): Promise<TripAdvisorActivity> {
  // If activity already has a good description, return as-is
  if (activity.description && activity.description.length >= 100) {
    return activity;
  }

  let tripAdvisorDescription: string | undefined;

  try {
    // Fetch full details from TripAdvisor
    console.log(`[Sync] Fetching details for: ${activity.name} (${activity.locationId})`);
    await delay(RATE_LIMIT_DELAY_MS); // Rate limit delay
    
    const locationDetails = await tripAdvisorClient.getLocationDetails(activity.locationId);
    
    // Extract description from TripAdvisor location details
    // The locationToActivity method doesn't include description, so we need to get it directly
    if (locationDetails?.description && locationDetails.description.length >= 100) {
      tripAdvisorDescription = locationDetails.description;
      console.log(`[Sync] Found TripAdvisor description (${tripAdvisorDescription.length} chars) for: ${activity.name}`);
    }
  } catch (error) {
    console.warn(`[Sync] Failed to fetch TripAdvisor details for ${activity.locationId}:`, error);
  }

  // If we got a TripAdvisor description, use it
  if (tripAdvisorDescription) {
    return {
      ...activity,
      description: tripAdvisorDescription,
    };
  }

  // If no TripAdvisor description, generate AI description
  if (!activity.description || activity.description.length < 100) {
    try {
      console.log(`[Sync] Generating AI description for: ${activity.name}`);
      await delay(RATE_LIMIT_DELAY_MS); // Rate limit delay
      
      const generated = await generateActivityDescription({
        name: activity.name,
        category: activity.category,
        subcategories: activity.subcategories,
        city: cityName,
        country: countryName,
        rating: activity.rating,
        reviewCount: activity.reviewCount,
        priceLevel: activity.priceLevel,
      });

      return {
        ...activity,
        description: generated.fullDescription || generated.shortDescription,
        highlights: generated.highlights || activity.highlights,
      };
    } catch (error) {
      console.warn(`[Sync] Failed to generate AI description for ${activity.name}:`, error);
    }
  }

  return activity;
}

/**
 * POST /api/tripadvisor/sync
 * Sync activities for all cities in Europe (or specific city)
 * 
 * Request body (optional):
 * {
 *   "cityId": "optional-city-id", // If provided, sync only this city
 *   "limit": 30, // Number of activities to fetch per city
 *   "skipExisting": true // Skip cities that already have activities
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { cityId, limit = 30, skipExisting = false } = body;

    // Check if TripAdvisor API key is configured
    if (!process.env.TRIPADVISOR_API_KEY) {
      return NextResponse.json(
        { error: 'TRIPADVISOR_API_KEY is not configured' },
        { status: 500 }
      );
    }

    let cities;
    if (cityId) {
      // Sync specific city
      const { getCity } = await import('@/lib/cosmos-cities');
      const city = await getCity(cityId);
      cities = city ? [city] : [];
    } else {
      // Sync all cities in Europe
      cities = await getAllCities('europe');
    }

    if (cities.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No cities found to sync',
        synced: [],
        skipped: [],
        errors: [],
      });
    }

    // Limit number of cities per run to respect rate limits
    const citiesToProcess = cities.slice(0, MAX_CITIES_PER_RUN);
    
    if (cities.length > MAX_CITIES_PER_RUN) {
      console.log(`[Sync] Limiting to ${MAX_CITIES_PER_RUN} cities per run. Total cities: ${cities.length}`);
    }

    const results = {
      synced: [] as Array<{ cityId: string; cityName: string; activitiesCount: number; defaultsSet: number }>,
      skipped: [] as Array<{ cityId: string; cityName: string; reason: string }>,
      errors: [] as Array<{ cityId: string; cityName: string; error: string }>,
    };

    console.log(`[Sync] Starting sync for ${citiesToProcess.length} cities in Europe`);

    for (let i = 0; i < citiesToProcess.length; i++) {
      const city = citiesToProcess[i];
      const cityName = `${city.city}, ${city.country || ''}`;
      
      console.log(`[Sync] Processing city ${i + 1}/${citiesToProcess.length}: ${cityName}`);

      try {
        // Skip if already has activities and skipExisting is true
        if (skipExisting && city.tripAdvisorActivities && city.tripAdvisorActivities.length > 0) {
          console.log(`[Sync] Skipping ${cityName} - already has ${city.tripAdvisorActivities.length} activities`);
          results.skipped.push({
            cityId: city.id,
            cityName: city.city,
            reason: 'Already has activities',
          });
          continue;
        }

        // Fetch activities from TripAdvisor
        await delay(RATE_LIMIT_DELAY_MS); // Rate limit delay
        const activities = await tripAdvisorClient.searchCityAttractions(
          city.city,
          city.country || '',
          { limit, includePhotos: true }
        );

        if (activities.length === 0) {
          console.log(`[Sync] No activities found for ${cityName}`);
          results.skipped.push({
            cityId: city.id,
            cityName: city.city,
            reason: 'No activities found',
          });
          continue;
        }

        console.log(`[Sync] Found ${activities.length} activities for ${cityName}`);

        // Enrich activities with descriptions
        const enrichedActivities: TripAdvisorActivity[] = [];
        for (let j = 0; j < activities.length; j++) {
          const activity = activities[j];
          try {
            const enriched = await enrichActivityWithDescription(
              activity,
              city.city,
              city.country
            );
            enrichedActivities.push(enriched);
            
            // Log progress every 5 activities
            if ((j + 1) % 5 === 0) {
              console.log(`[Sync] Enriched ${j + 1}/${activities.length} activities for ${cityName}`);
            }
          } catch (error: any) {
            console.warn(`[Sync] Failed to enrich activity ${activity.name}:`, error);
            // Still add the activity even if enrichment failed
            enrichedActivities.push(activity);
          }
        }

        // Select top 2 activities as defaults
        const topActivities = selectTopActivities(enrichedActivities);
        const activitiesWithDefaults = enrichedActivities.map((activity) => {
          const isTop = topActivities.some(top => top.locationId === activity.locationId);
          return {
            ...activity,
            isDefault: isTop,
            lastSynced: new Date().toISOString(),
          };
        });

        // Update city with activities
        await updateCityActivities(city.id, activitiesWithDefaults);

        const defaultsCount = topActivities.length;
        console.log(`[Sync] ✅ Completed ${cityName}: ${activitiesWithDefaults.length} activities, ${defaultsCount} defaults`);

        results.synced.push({
          cityId: city.id,
          cityName: city.city,
          activitiesCount: activitiesWithDefaults.length,
          defaultsSet: defaultsCount,
        });
      } catch (error: any) {
        console.error(`[Sync] ❌ Error processing ${cityName}:`, error);
        results.errors.push({
          cityId: city.id,
          cityName: city.city,
          error: error.message || 'Unknown error',
        });
      }

      // Add delay between cities to respect rate limits
      if (i < citiesToProcess.length - 1) {
        await delay(RATE_LIMIT_DELAY_MS);
      }
    }

    console.log(`[Sync] ✅ Sync complete. Synced: ${results.synced.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`);

    return NextResponse.json({
      success: true,
      message: `Sync completed for ${results.synced.length} cities`,
      ...results,
      totalProcessed: citiesToProcess.length,
      remainingCities: cities.length - citiesToProcess.length,
    });
  } catch (error: any) {
    console.error('[Sync] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync activities',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tripadvisor/sync
 * Get sync status for all cities
 */
export async function GET(request: NextRequest) {
  try {
    const cities = await getAllCities('europe');
    
    const status = cities.map(city => ({
      cityId: city.id,
      cityName: city.city,
      country: city.country,
      activitiesCount: city.tripAdvisorActivities?.length || 0,
      defaultsCount: city.tripAdvisorActivities?.filter(a => a.isDefault).length || 0,
      lastSynced: city.tripAdvisorActivities?.[0]?.lastSynced || null,
    }));

    return NextResponse.json({
      totalCities: cities.length,
      citiesWithActivities: status.filter(s => s.activitiesCount > 0).length,
      citiesWithDefaults: status.filter(s => s.defaultsCount > 0).length,
      status,
    });
  } catch (error: any) {
    console.error('[Sync Status] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get sync status',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
