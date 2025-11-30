import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  // Fallback for demo if key is missing (optional, but good for stability if user forgot key)
  if (!accessKey) {
     console.warn("UNSPLASH_ACCESS_KEY is missing");
     return NextResponse.json([], { status: 200 }); // Return empty list instead of crashing
  }

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });
    
    if (!res.ok) {
        console.error("Unsplash API error:", await res.text());
        throw new Error("Unsplash API error");
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

