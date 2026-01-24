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
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = req.params.id;
  if (!id) {
    return createCorsResponse({ error: 'Default trip ID is required' }, 400);
  }

  try {
    if (!isCosmosDBConfigured()) {
      return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
    }

    if (req.method === 'GET') {
      const trip = await getDefaultTripById(id);
      if (!trip) return createCorsResponse({ error: 'Not found' }, 404);
      return createCorsResponse({ trip });
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
      return createCorsResponse({ trip });
    }

    if (req.method === 'DELETE') {
      await deleteDefaultTrip(id);
      return createCorsResponse({ success: true });
    }

    return createCorsResponse({ error: 'Method not allowed' }, 405);
  } catch (error: any) {
    context.log(
      `Error processing default trip request: ${error instanceof Error ? error.message : String(error)}`
    );
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

module.exports = { defaultTripsById };
