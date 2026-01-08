import { NextRequest, NextResponse } from 'next/server';
import {
  getCity,
  updateCityActivities,
  removeCityActivity,
  toggleActivityDefault,
  toggleActivityCurated,
} from '@/lib/cosmos-cities';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * GET /api/cities/[id]/activities
 * Get all activities for a city
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const city = await getCity(id);
    
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({
      activities: city.tripAdvisorActivities || [],
    });
  } catch (error: any) {
    console.error('[GET /api/cities/[id]/activities] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cities/[id]/activities
 * Update all activities for a city
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { activities } = body;

    if (!Array.isArray(activities)) {
      return NextResponse.json(
        { error: 'activities must be an array' },
        { status: 400 }
      );
    }

    await updateCityActivities(id, activities);
    const updatedCity = await getCity(id);
    
    return NextResponse.json({
      activities: updatedCity?.tripAdvisorActivities || [],
    });
  } catch (error: any) {
    console.error('[PUT /api/cities/[id]/activities] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update activities' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cities/[id]/activities
 * Add or update a single activity in the city
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activity = await request.json();

    if (!activity || !activity.locationId) {
      return NextResponse.json(
        { error: 'Valid activity with locationId is required' },
        { status: 400 }
      );
    }

    // Use the helper from cosmos-cities to add/update
    const { addCityActivity } = await import('@/lib/cosmos-cities');
    await addCityActivity(id, activity);
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[POST /api/cities/[id]/activities] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save activity' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cities/[id]/activities?locationId=xxx
 * Update a specific activity (e.g., toggle default status)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    const body = await request.json();

    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId query parameter is required' },
        { status: 400 }
      );
    }

    if (body.isDefault !== undefined) {
      await toggleActivityDefault(id, locationId, body.isDefault);
    }

    if (body.isCurated !== undefined) {
      await toggleActivityCurated(id, locationId, body.isCurated);
    }

    const updatedCity = await getCity(id);
    
    return NextResponse.json({
      activities: updatedCity?.tripAdvisorActivities || [],
    });
  } catch (error: any) {
    console.error('[PATCH /api/cities/[id]/activities] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update activity' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cities/[id]/activities?locationId=xxx
 * Remove an activity from a city
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId query parameter is required' },
        { status: 400 }
      );
    }

    await removeCityActivity(id, locationId);
    const updatedCity = await getCity(id);
    
    return NextResponse.json({
      activities: updatedCity?.tripAdvisorActivities || [],
    });
  } catch (error: any) {
    console.error('[DELETE /api/cities/[id]/activities] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove activity' },
      { status: 500 }
    );
  }
}

