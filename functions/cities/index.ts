import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
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

export async function cities(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    if (request.method === 'GET') {
      const region = request.query.get('region');

      // Validate region if provided
      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (region && !validRegions.includes(region)) {
        return createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400,
          origin
        );
      }

      if (!isCosmosDBConfigured()) {
        context.log('[cities] CosmosDB not configured, returning empty array');
        return createCorsResponse({ cities: [] }, 200, origin);
      }

      const cities = await getAllCities(region || undefined);
      context.log(`[cities] Retrieved ${cities.length} cities${region ? ` for region: ${region}` : ''}`);
      
      return createCorsResponse({ cities }, 200, origin);
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405, origin);
    }
  } catch (error: any) {
    context.log(`[cities] Error processing cities request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500,
      origin
    );
  }
}

app.http('cities', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: cities,
});
