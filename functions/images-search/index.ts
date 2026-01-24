import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCorsHeaders, createCorsResponse } from '../shared/cors';

export async function imagesSearch(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  const origin = req.headers['origin'] as string | null;
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  const query = (req.query as any).query;

  if (!query) {
    (context as any).res = createCorsResponse({ error: 'Query required' }, 400, origin); return;
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    context.log("UNSPLASH_ACCESS_KEY is missing");
    (context as any).res = createCorsResponse([], 200, origin); return;
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

    (context as any).res = createCorsResponse(images, 200, origin); return;
  } catch (error: any) {
    context.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse({ error: 'Failed to fetch images' }, 500, origin); return;
  }
}

module.exports = { imagesSearch };
