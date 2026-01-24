import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getAllCities } from '../shared/cosmos-cities';
import { getCorsHeaders, createCorsResponse } from '../shared/cors';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function cities(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  const origin = req.headers['origin'] as string | null;
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  try {
    if (req.method === 'GET') {
      const region = (req.query as any).region as string | undefined;

      // Validate region if provided
      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (region && !validRegions.includes(region)) {
        (context as any).res = createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400,
          origin
        ); return;
      }

      if (!isCosmosDBConfigured()) {
        context.log('[cities] CosmosDB not configured, returning empty array');
        (context as any).res = createCorsResponse({ cities: [] }, 200, origin); return;
      }

      const cities = await getAllCities(region || undefined);
      context.log(`[cities] Retrieved ${cities.length} cities${region ? ` for region: ${region}` : ''}`);
      
      (context as any).res = createCorsResponse({ cities }, 200, origin); return;
    } else {
      (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405, origin); return;
    }
  } catch (error: any) {
    context.log(`[cities] Error processing cities request: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500,
      origin
    ); return;
  }
}

module.exports = { cities };