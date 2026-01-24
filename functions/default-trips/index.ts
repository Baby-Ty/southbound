import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { corsHeaders, createCorsResponse } from '../shared/cors';
import { createDefaultTrip, getDefaultTrips, DefaultTrip } from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function defaultTrips(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    if (req.method === 'GET') {
      const region = (req.query as any).region || undefined;
      const enabledParam = (req.query as any).enabled;
      const enabled =
        enabledParam === null || enabledParam === undefined
          ? undefined
          : enabledParam === 'true'
            ? true
            : false;

      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ trips: [] });
      }

      const trips = await getDefaultTrips({
        ...(region ? { region } : {}),
        ...(typeof enabled === 'boolean' ? { enabled } : {}),
      });
      return createCorsResponse({ trips });
    }

    if (req.method === 'POST') {
      const body = req.body as Partial<
        Omit<DefaultTrip, 'id' | 'createdAt' | 'updatedAt'>
      >;

      if (!body?.name || !body?.region || !Array.isArray(body?.stops)) {
        return createCorsResponse(
          { error: 'Missing required fields: name, region, stops' },
          400
        );
      }

      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      const trip = await createDefaultTrip({
        name: String(body.name).trim(),
        region: String(body.region),
        enabled: body.enabled ?? true,
        order: typeof body.order === 'number' && Number.isFinite(body.order) ? body.order : 0,
        stops: body.stops as any,
        notes: body.notes ? String(body.notes) : undefined,
      });

      return createCorsResponse({ trip }, 201);
    }

    return createCorsResponse({ error: 'Method not allowed' }, 405);
  } catch (error: any) {
    context.log(
      `Error processing default trips request: ${error instanceof Error ? error.message : String(error)}`
    );
    return createCorsResponse(
      {
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      500
    );
  }
}

module.exports = { defaultTrips };
