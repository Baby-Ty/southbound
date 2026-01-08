import { NextRequest, NextResponse } from 'next/server';
import { apiUrl } from '@/lib/api';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * GET /api/images-search?query=...
 * 
 * Proxy Unsplash image search through server-side API
 * This allows using UNSPLASH_ACCESS_KEY (server-side) instead of NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Check if we should use Azure Functions (if configured)
    const functionsUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL;
    if (functionsUrl && !functionsUrl.startsWith('/')) {
      // Use Azure Functions endpoint
      try {
        const response = await fetch(`${functionsUrl}/api/images-search?query=${encodeURIComponent(query)}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (error) {
        console.error('[images-search] Azure Functions error, falling back to direct API:', error);
      }
    }

    // Fallback: Call Unsplash API directly from server
    const accessKey = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      return NextResponse.json(
        { error: 'Unsplash API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey.trim()}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[images-search] Unsplash API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Unsplash API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform to match expected format
    const results = (data.results || []).map((photo: any) => ({
      id: photo.id,
      url: photo.urls?.raw || photo.urls?.regular || photo.urls?.small,
      thumb: photo.urls?.small || photo.urls?.thumb,
      alt: photo.alt_description || photo.description || '',
      user: photo.user?.name || 'Unsplash',
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('[images-search] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to search images',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

