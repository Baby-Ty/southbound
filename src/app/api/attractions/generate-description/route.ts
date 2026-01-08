import { NextRequest, NextResponse } from 'next/server';
import { generateActivityDescription } from '@/lib/aiDescriptionGenerator';

// Required for static export - tells Next.js this route is dynamic and should be skipped
export const dynamic = 'force-dynamic';

/**
 * POST /api/attractions/generate-description
 * 
 * Generate AI-powered descriptions for activities that lack sufficient detail.
 * Can be triggered manually by admins or automatically when displaying activities.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      subcategories,
      city,
      country,
      rating,
      reviewCount,
      priceLevel,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Activity name is required' },
        { status: 400 }
      );
    }

    // Generate the description
    const generatedContent = await generateActivityDescription({
      name,
      category,
      subcategories,
      city,
      country,
      rating,
      reviewCount,
      priceLevel,
    });

    return NextResponse.json({
      success: true,
      generated: generatedContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate description',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

