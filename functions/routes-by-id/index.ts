import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getRoute, updateRoute, deleteRoute, SavedRoute } from '../shared/cosmos';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

async function routesByIdHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = request.params.id;

  if (!id) {
    return createCorsResponse({ error: 'Route ID is required' }, 400);
  }

  try {
    if (request.method === 'GET') {
      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      const route = await getRoute(id);
      
      if (!route) {
        return createCorsResponse({ error: 'Route not found' }, 404);
      }

      return createCorsResponse({ route });
    } else if (request.method === 'PATCH') {
      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      const body = await request.json() as {
        status?: SavedRoute['status'];
        stops?: any;
        preferences?: any;
        notes?: string;
        adminNotes?: string;
      };
      
      const allowedUpdates: Partial<SavedRoute> = {};
      
      if (body.status !== undefined) {
        allowedUpdates.status = body.status;
      }
      if (body.stops !== undefined) {
        allowedUpdates.stops = body.stops;
      }
      if (body.preferences !== undefined) {
        allowedUpdates.preferences = body.preferences;
      }
      if (body.notes !== undefined) {
        allowedUpdates.notes = body.notes;
      }
      if (body.adminNotes !== undefined) {
        allowedUpdates.adminNotes = body.adminNotes;
      }

      const route = await updateRoute(id, allowedUpdates);
      return createCorsResponse({ route });
    } else if (request.method === 'DELETE') {
      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      await deleteRoute(id);
      return createCorsResponse({ success: true });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log(`Error processing route request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

// Register with Azure Functions v4 runtime
app.http('routes-by-id', {
  methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'routes/{id}',
  handler: routesByIdHandler
});
