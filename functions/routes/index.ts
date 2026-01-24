import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
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

async function routesHandler(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  try {
    if (req.method === 'POST') {
      const body = req.body as {
        name?: string;
        email?: string;
        region?: string;
        stops?: any;
        preferences?: any;
        notes?: string;
      };
      
      const { name, email, region, stops, preferences, notes } = body;

      if (!name || !email || !region || !stops || !preferences) {
        (context as any).res = createCorsResponse(
          { error: 'Missing required fields: name, email, region, stops, preferences' },
          400
        ); return;
      }

      if (!name.trim()) {
        (context as any).res = createCorsResponse(
          { error: 'Name is required' },
          400
        ); return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/;
      if (!emailRegex.test(email)) {
        (context as any).res = createCorsResponse(
          { error: 'Invalid email format' },
          400
        ); return;
      }

      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse(
          { error: 'CosmosDB is not configured' },
          500
        ); return;
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

      (context as any).res = createCorsResponse({ route }, 201); return;
    } else if (req.method === 'GET') {
      const status = (req.query as any).status as SavedRoute['status'] | null;
      const email = (req.query as any).email;
      const region = (req.query as any).region;

      const filters = {
        ...(status && { status }),
        ...(email && { email }),
        ...(region && { region }),
      };

      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ routes: [] }); return;
      }

      const routes = await getAllRoutes(filters);
      (context as any).res = createCorsResponse({ routes }); return;
    } else {
      (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
    }
  } catch (error: any) {
    context.log(`Error processing routes request: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    ); return;
  }
}

// Export for Azure Functions v3 runtime
module.exports = { routesHandler };
