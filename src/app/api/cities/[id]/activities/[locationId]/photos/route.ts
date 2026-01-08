import { NextRequest, NextResponse } from 'next/server';
import { getCity, updateCityActivities } from '@/lib/cosmos-cities';
import { tripAdvisorClient } from '@/lib/tripadvisor';
import { uploadActivityPhotos } from '@/lib/azureBlob';

// Only export dynamic if static export is disabled
// Next.js route segment config must be statically analyzable (no env conditionals).
export const dynamic = 'force-dynamic';

/**
 * POST /api/cities/[id]/activities/[locationId]/photos
 * Download photos from TripAdvisor and store them in Azure Blob Storage
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; locationId: string }> }
) {
  try {
    const { id: cityId, locationId } = await params;
    const body = await request.json();
    const { limit = 5 } = body;

    // Check if Azure Storage is configured
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      return NextResponse.json(
        { error: 'Azure Storage is not configured' },
        { status: 500 }
      );
    }

    // Check if TripAdvisor API key is configured
    if (!process.env.TRIPADVISOR_API_KEY) {
      return NextResponse.json(
        { error: 'TripAdvisor API key is not configured' },
        { status: 500 }
      );
    }

    // Get the city
    const city = await getCity(cityId);
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Find the activity
    const activities = city.tripAdvisorActivities || [];
    const activity = activities.find((a) => a.locationId === locationId);
    
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Check if photos are already uploaded to blob
    if (activity.blobPhotos && activity.blobPhotos.length > 0) {
      return NextResponse.json({
        activity,
        message: 'Photos already uploaded to blob storage',
      });
    }

    // Fetch photos from TripAdvisor
    let photoUrls: string[] = [];
    
    // Use photos array if available, otherwise fall back to images
    if (activity.photos && activity.photos.length > 0) {
      photoUrls = activity.photos
        .slice(0, limit)
        .map((photo) => 
          photo.images?.large?.url || 
          photo.images?.medium?.url || 
          photo.images?.original?.url
        )
        .filter((url): url is string => !!url);
    } else if (activity.images && activity.images.length > 0) {
      photoUrls = activity.images.slice(0, limit);
    } else {
      // Fetch fresh photos from TripAdvisor
      try {
        const photos = await tripAdvisorClient.getLocationPhotos(locationId, { limit });
        photoUrls = photos
          .map((photo) => 
            photo.images?.large?.url || 
            photo.images?.medium?.url || 
            photo.images?.original?.url
          )
          .filter((url): url is string => !!url);
      } catch (error: any) {
        console.error('Failed to fetch photos from TripAdvisor:', error);
        return NextResponse.json(
          { error: 'Failed to fetch photos from TripAdvisor', details: error.message },
          { status: 500 }
        );
      }
    }

    if (photoUrls.length === 0) {
      return NextResponse.json(
        { error: 'No photos available for this activity' },
        { status: 404 }
      );
    }

    // Upload photos to blob storage
    let blobUrls: string[] = [];
    try {
      blobUrls = await uploadActivityPhotos(photoUrls, cityId, locationId);
    } catch (error: any) {
      console.error('Failed to upload photos to blob storage:', error);
      return NextResponse.json(
        { error: 'Failed to upload photos to blob storage', details: error.message },
        { status: 500 }
      );
    }

    // Update activity with blob URLs
    const updatedActivity = {
      ...activity,
      blobPhotos: blobUrls,
    };

    // Update the activity in the city's activities array
    const updatedActivities = activities.map((a) =>
      a.locationId === locationId ? updatedActivity : a
    );

    // Save to Cosmos DB
    await updateCityActivities(cityId, updatedActivities);

    return NextResponse.json({
      activity: updatedActivity,
      message: `Successfully uploaded ${blobUrls.length} photos to blob storage`,
    });
  } catch (error: any) {
    console.error('[Upload Activity Photos] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload activity photos' },
      { status: 500 }
    );
  }
}

