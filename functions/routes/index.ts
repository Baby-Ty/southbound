import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { saveRoute, getAllRoutes, SavedRoute } from '../shared/cosmos';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function routes(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    if (request.method === 'POST') {
      const body = await request.json() as {
        name?: string;
        email?: string;
        region?: string;
        stops?: any;
        preferences?: any;
        notes?: string;
      };
      
      const { name, email, region, stops, preferences, notes } = body;

      if (!name || !email || !region || !stops || !preferences) {
        return createCorsResponse(
          { error: 'Missing required fields: name, email, region, stops, preferences' },
          400
        );
      }

      if (!name.trim()) {
        return createCorsResponse(
          { error: 'Name is required' },
          400
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/;
      if (!emailRegex.test(email)) {
        return createCorsResponse(
          { error: 'Invalid email format' },
          400
        );
      }

      if (!isCosmosDBConfigured()) {
        return createCorsResponse(
          { error: 'CosmosDB is not configured' },
          500
        );
      }

      const route = await saveRoute({
        name: name.trim(),
        email,
        region,
        stops,
        preferences,
        status: 'draft',
        notes: notes || '',
      });

      return createCorsResponse({ route }, 201);
    } else if (request.method === 'GET') {
      const status = request.query.get('status') as SavedRoute['status'] | null;
      const email = request.query.get('email');
      const region = request.query.get('region');

      const filters = {
        ...(status && { status }),
        ...(email && { email }),
        ...(region && { region }),
      };

      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ routes: [] });
      }

      const routes = await getAllRoutes(filters);
      return createCorsResponse({ routes });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log(`Error processing routes request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  }
}

module.exports = { routes };
