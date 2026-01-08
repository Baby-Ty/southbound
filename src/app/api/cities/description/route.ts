import { NextRequest, NextResponse } from 'next/server';
import { tripAdvisorClient } from '@/lib/tripadvisor';
import { generateActivityDescription } from '@/lib/aiDescriptionGenerator';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * POST /api/cities/description
 * 
 * Fetch or generate city description from TripAdvisor or AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, country, source } = body;

    if (!city) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    if (source === 'tripadvisor') {
      // Check if API key is configured
      if (!process.env.TRIPADVISOR_API_KEY) {
        return NextResponse.json(
          { error: 'TripAdvisor API key not configured' },
          { status: 500 }
        );
      }

      // Search for the city location
      const searchQuery = country ? `${city}, ${country}` : city;
      const locations = await tripAdvisorClient.searchLocations(searchQuery, {
        limit: 1,
        language: 'en',
      });

      if (locations.length === 0) {
        return NextResponse.json(
          { error: `City "${city}" not found on TripAdvisor` },
          { status: 404 }
        );
      }

      // Get full details including description
      const locationDetails = await tripAdvisorClient.getLocationDetails(
        locations[0].location_id
      );

      if (!locationDetails) {
        return NextResponse.json(
          { error: 'Failed to fetch city details' },
          { status: 500 }
        );
      }

      // Use description from TripAdvisor if available
      const description = locationDetails.description || 
        `Discover ${city}${country ? `, ${country}` : ''}, a vibrant destination offering unique experiences and attractions.`;

      return NextResponse.json({ description });
    } else if (source === 'ai') {
      // Generate description using AI
      try {
        const generated = await generateActivityDescription({
          name: city,
          city: city,
          country: country,
        });

        // Use the full description from AI
        const description = generated.fullDescription || generated.shortDescription || 
          `Experience the charm of ${city}${country ? `, ${country}` : ''}, a destination that combines rich culture, stunning landscapes, and unforgettable experiences.`;

        return NextResponse.json({ description });
      } catch (error: any) {
        console.error('AI generation error:', error);
        // Fallback to template-based description
        const description = `${city}${country ? `, ${country}` : ''} is a captivating destination that offers travelers a unique blend of culture, history, and modern attractions. Whether you're seeking adventure, relaxation, or cultural immersion, this city has something special to offer every visitor.`;
        return NextResponse.json({ description });
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid source. Must be "tripadvisor" or "ai"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[City Description] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch/generate description',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

