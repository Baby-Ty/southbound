import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getAllCities } from '../shared/cosmos-cities';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function cities(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
          400
        );
      }

      if (!isCosmosDBConfigured()) {
        context.log('[cities] CosmosDB not configured, returning empty array');
        return createCorsResponse({ cities: [] });
      }

      const cities = await getAllCities(region || undefined);
      context.log(`[cities] Retrieved ${cities.length} cities${region ? ` for region: ${region}` : ''}`);
      
      return createCorsResponse({ cities });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log(`[cities] Error processing cities request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  }
}

app.http('cities', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: cities,
});
