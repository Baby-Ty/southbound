import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { corsHeaders, createCorsResponse } from '../shared/cors';
import {
  deleteTripTemplate,
  getTripTemplateById,
  updateTripTemplate,
  TripTemplate,
} from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function tripTemplatesById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = request.params.id;
  if (!id) {
    return createCorsResponse({ error: 'Trip template ID is required' }, 400);
  }

  try {
    if (!isCosmosDBConfigured()) {
      return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
    }

    if (request.method === 'GET') {
      // For GET, we need region from query params since it's the partition key
      const region = request.query.get('region');
      if (!region) {
        return createCorsResponse({ error: 'Region query parameter is required' }, 400);
      }
      
      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(region)) {
        return createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400
        );
      }

      const template = await getTripTemplateById(id, region);
      if (!template) return createCorsResponse({ error: 'Not found' }, 404);
      return createCorsResponse({ template });
    }

    if (request.method === 'PATCH') {
      const body = (await request.json()) as Partial<TripTemplate>;
      const region = body.region || request.query.get('region');
      
      if (!region) {
        return createCorsResponse({ error: 'Region is required (in body or query)' }, 400);
      }

      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(region)) {
        return createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400
        );
      }

      const allowed: Partial<Omit<TripTemplate, 'id' | 'createdAt' | 'updatedAt' | 'region'>> = {};

      if (body.name !== undefined) allowed.name = String(body.name).trim();
      if (body.description !== undefined) allowed.description = String(body.description).trim();
      if (body.icon !== undefined) allowed.icon = String(body.icon).trim();
      if (body.imageUrl !== undefined) allowed.imageUrl = String(body.imageUrl).trim();
      if (body.presetCities !== undefined) {
        allowed.presetCities = Array.isArray(body.presetCities)
          ? body.presetCities.map(c => String(c).trim())
          : [];
      }
      if (body.tags !== undefined) {
        allowed.tags = Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()) : [];
      }
      if (body.enabled !== undefined) allowed.enabled = !!body.enabled;
      if (body.order !== undefined) allowed.order = Number(body.order) || 0;

      const template = await updateTripTemplate(id, region, allowed);
      return createCorsResponse({ template });
    }

    if (request.method === 'DELETE') {
      const region = request.query.get('region');
      if (!region) {
        return createCorsResponse({ error: 'Region query parameter is required' }, 400);
      }

      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(region)) {
        return createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400
        );
      }

      await deleteTripTemplate(id, region);
      return createCorsResponse({ success: true });
    }

    return createCorsResponse({ error: 'Method not allowed' }, 405);
  } catch (error: any) {
    context.log(
      `Error processing trip template request: ${error instanceof Error ? error.message : String(error)}`
    );
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

app.http('trip-templates-by-id', {
  methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'trip-templates/{id}',
  handler: tripTemplatesById,
});

