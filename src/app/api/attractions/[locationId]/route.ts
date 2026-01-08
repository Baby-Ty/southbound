import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { tripAdvisorClient } from '@/lib/tripadvisor';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * GET /api/attractions/[locationId]
 * 
 * Fetch enriched attraction data by combining:
 * 1. Admin-curated content from Sanity CMS
 * 2. Real-time data from TripAdvisor API
 * 
 * Admin content takes precedence when available.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const { locationId } = await params;

  if (!locationId) {
    return NextResponse.json(
      { error: 'Location ID is required' },
      { status: 400 }
    );
  }

  try {
    // Query Sanity for admin-enriched attraction data
    const sanityAttraction = await client.fetch(
      `*[_type == "attraction" && tripAdvisorLocationId == $locationId][0] {
        _id,
        name,
        slug,
        city->{
          _id,
          name
        },
        category,
        shortDescription,
        description,
        adminNotes,
        "heroImageUrl": heroImage.asset->url,
        "galleryImages": gallery[].asset->url,
        highlights,
        duration,
        bestTimeToVisit,
        difficulty,
        priceRange,
        estimatedCost,
        bookingRequired,
        bookingUrl,
        amenities,
        whatToKnow,
        address,
        coordinates,
        phone,
        website,
        email,
        openingHours,
        tripAdvisorLocationId,
        overrideTripAdvisorData,
        syncWithTripAdvisor,
        lastSyncedAt,
        featured,
        status
      }`,
      { locationId }
    );

    // Fetch TripAdvisor data
    let tripAdvisorData = null;
    try {
      const taLocation = await tripAdvisorClient.getLocationDetails(locationId);
      if (taLocation) {
        tripAdvisorData = await tripAdvisorClient.locationToActivity(taLocation, true);
      }
    } catch (error) {
      console.error('Failed to fetch TripAdvisor data:', error);
      // Continue even if TripAdvisor fetch fails
    }

    // Merge data based on override settings
    const enrichedAttraction = mergeAttractionData(sanityAttraction, tripAdvisorData);

    return NextResponse.json(enrichedAttraction);
  } catch (error) {
    console.error('Error fetching attraction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attraction data' },
      { status: 500 }
    );
  }
}

/**
 * Merge Sanity CMS data with TripAdvisor data
 * Admin content takes precedence when overrideTripAdvisorData is true
 */
function mergeAttractionData(sanityData: any, tripAdvisorData: any) {
  // If no Sanity data, return TripAdvisor data
  if (!sanityData) {
    return {
      source: 'tripadvisor',
      data: tripAdvisorData,
    };
  }

  // If override is disabled or no TripAdvisor data, return Sanity data only
  if (!sanityData.overrideTripAdvisorData || !tripAdvisorData) {
    return {
      source: 'sanity',
      data: sanityData,
    };
  }

  // Merge with admin content taking precedence
  const merged = {
    // Identifiers
    _id: sanityData._id,
    locationId: tripAdvisorData.locationId,
    slug: sanityData.slug,

    // Basic Info (admin overrides)
    name: sanityData.name || tripAdvisorData.name,
    category: sanityData.category || tripAdvisorData.category,
    
    // Descriptions
    shortDescription: sanityData.shortDescription,
    description: sanityData.description, // Rich text from Sanity
    descriptionText: tripAdvisorData.description, // Plain text from TripAdvisor (fallback)
    
    // Media (admin + TripAdvisor)
    heroImage: sanityData.heroImageUrl,
    gallery: sanityData.galleryImages || [],
    tripAdvisorPhotos: tripAdvisorData.photos || [],
    images: [
      ...(sanityData.heroImageUrl ? [sanityData.heroImageUrl] : []),
      ...(sanityData.galleryImages || []),
      ...(tripAdvisorData.images || []),
    ],

    // Details (admin overrides)
    highlights: sanityData.highlights || [],
    duration: sanityData.duration,
    bestTimeToVisit: sanityData.bestTimeToVisit,
    difficulty: sanityData.difficulty,
    
    // Pricing (admin overrides, TripAdvisor as fallback)
    priceRange: sanityData.priceRange || tripAdvisorData.priceLevel,
    estimatedCost: sanityData.estimatedCost,
    
    // Booking
    bookingRequired: sanityData.bookingRequired,
    bookingUrl: sanityData.bookingUrl,
    
    // Features (merge both)
    amenities: [
      ...(sanityData.amenities || []),
      ...(tripAdvisorData.amenities || []),
    ].filter((item, index, arr) => arr.indexOf(item) === index), // Remove duplicates
    
    whatToKnow: sanityData.whatToKnow || [],
    subcategories: tripAdvisorData.subcategories || [],

    // Location (admin overrides, TripAdvisor as fallback)
    address: sanityData.address || tripAdvisorData.address,
    coordinates: sanityData.coordinates || tripAdvisorData.coordinates,
    
    // Contact (admin overrides)
    phone: sanityData.phone || tripAdvisorData.phone,
    website: sanityData.website || tripAdvisorData.website,
    email: sanityData.email,
    
    // Hours (admin overrides, TripAdvisor as fallback)
    openingHours: sanityData.openingHours,
    tripAdvisorHours: tripAdvisorData.hours,
    
    // Ratings (always from TripAdvisor - live data)
    rating: tripAdvisorData.rating,
    reviewCount: tripAdvisorData.reviewCount,
    reviewRatingCount: tripAdvisorData.reviewRatingCount,
    webUrl: tripAdvisorData.webUrl,

    // Metadata
    city: sanityData.city,
    featured: sanityData.featured,
    status: sanityData.status,
    lastSynced: tripAdvisorData.lastSynced,
    adminNotes: sanityData.adminNotes,
  };

  return {
    source: 'merged',
    data: merged,
  };
}

