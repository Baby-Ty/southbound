import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API route for Unsplash image search
 * Proxies to Unsplash API or returns empty array if API key is missing
 */

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      console.warn('[API /api/images/search] UNSPLASH_ACCESS_KEY is missing');
      // Return empty array instead of error to allow UI to continue working
      return NextResponse.json([]);
    }

    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`;
    
    const res = await fetch(unsplashUrl, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API /api/images/search] Unsplash API error:', errorText);
      // Return empty array instead of error to allow UI to continue working
      return NextResponse.json([]);
    }

    const data = await res.json();
    
    const images = (data.results || []).map((img: any) => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.small,
      alt: img.alt_description,
      photographer: img.user.name,
      photographerUrl: img.user.links.html
    }));

    return NextResponse.json(images);
  } catch (error: any) {
    console.error('[API /api/images/search] Error:', error);
    // Return empty array instead of error to allow UI to continue working
    return NextResponse.json([]);
  }
}

