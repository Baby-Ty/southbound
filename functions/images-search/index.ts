import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCorsHeaders, createCorsResponse } from '../shared/cors';

export async function imagesSearch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const query = request.query.get('query');

  if (!query) {
    return createCorsResponse({ error: 'Query required' }, 400, origin);
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    context.log("UNSPLASH_ACCESS_KEY is missing");
    return createCorsResponse([], 200, origin);
  }

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      context.log(`Unsplash API error: ${errorText}`);
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

    return createCorsResponse(images, 200, origin);
  } catch (error: any) {
    context.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse({ error: 'Failed to fetch images' }, 500, origin);
  }
}

module.exports = { imagesSearch };
