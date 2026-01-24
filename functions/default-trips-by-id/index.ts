import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { corsHeaders, createCorsResponse } from '../shared/cors';
import {
  deleteDefaultTrip,
  getDefaultTripById,
  updateDefaultTrip,
  DefaultTrip,
} from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function defaultTripsById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  const id = req.params.id;
  if (!id) {
    (context as any).res = createCorsResponse({ error: 'Default trip ID is required' }, 400); return;
  }

  try {
    if (!isCosmosDBConfigured()) {
      (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
    }

    if (req.method === 'GET') {
      const trip = await getDefaultTripById(id);
      if (!trip) (context as any).res = createCorsResponse({ error: 'Not found' }, 404); return;
      (context as any).res = createCorsResponse({ trip }); return;
    }

    if (req.method === 'PATCH') {
      const body = req.body as Partial<DefaultTrip>;
      const allowed: Partial<DefaultTrip> = {};

      if (body.name !== undefined) allowed.name = String(body.name);
      if (body.enabled !== undefined) allowed.enabled = !!body.enabled;
      if (body.order !== undefined) allowed.order = Number(body.order) || 0;
      if (body.stops !== undefined) allowed.stops = body.stops as any;
      if (body.notes !== undefined) allowed.notes = body.notes ? String(body.notes) : undefined;

      const trip = await updateDefaultTrip(id, allowed as any);
      (context as any).res = createCorsResponse({ trip }); return;
    }

    if (req.method === 'DELETE') {
      await deleteDefaultTrip(id);
      (context as any).res = createCorsResponse({ success: true }); return;
    }

    (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
  } catch (error: any) {
    context.log(
      `Error processing default trip request: ${error instanceof Error ? error.message : String(error)}`
    );
    (context as any).res = createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    ); return;
  }
}

module.exports = { defaultTripsById };
