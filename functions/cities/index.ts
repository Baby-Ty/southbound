import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getAllCities } from '../shared/cosmos-cities';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function cities(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    const region = request.query.get('region') || undefined;

    context.log(`[API] Fetching cities, region: ${region}`);
    context.log(`[API] CosmosDB endpoint: ${process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET'}`);
    context.log(`[API] CosmosDB key: ${process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET'}`);

    const cities = await getAllCities(region);
    
    context.log(`[API] Success: Returning ${cities.length} cities`);
    
    return createCorsResponse({ cities });
  } catch (error: any) {
    context.log(`[API] Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse({ cities: [] });
  }
}

app.http('cities', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: cities,
});

