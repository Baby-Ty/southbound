import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
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

async function routesByIdHandler(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  const id = req.params.id;

  if (!id) {
    (context as any).res = createCorsResponse({ error: 'Route ID is required' }, 400); return;
  }

  try {
    if (req.method === 'GET') {
      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
      }

      const route = await getRoute(id);
      
      if (!route) {
        (context as any).res = createCorsResponse({ error: 'Route not found' }, 404); return;
      }

      (context as any).res = createCorsResponse({ route }); return;
    } else if (req.method === 'PATCH') {
      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
      }

      const body = req.body as {
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
      (context as any).res = createCorsResponse({ route }); return;
    } else if (req.method === 'DELETE') {
      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
      }

      await deleteRoute(id);
      (context as any).res = createCorsResponse({ success: true }); return;
    } else {
      (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
    }
  } catch (error: any) {
    context.log(`Error processing route request: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    ); return;
  }
}

// Export for Azure Functions v3 runtime
module.exports = { routesByIdHandler };
