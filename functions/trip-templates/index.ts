import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { corsHeaders, createCorsResponse } from '../shared/cors';
import { createTripTemplate, getTripTemplates, TripTemplate } from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function tripTemplates(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    if (request.method === 'GET') {
      const regionParam = request.query.get('region');
      const enabledParam = request.query.get('enabled');
      
      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      const region = regionParam && validRegions.includes(regionParam)
        ? (regionParam as 'europe' | 'latin-america' | 'southeast-asia')
        : undefined;
      
      const enabled =
        enabledParam === null || enabledParam === undefined
          ? undefined
          : enabledParam === 'true'
            ? true
            : false;

      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ templates: [] });
      }

      const templates = await getTripTemplates({
        ...(region ? { region } : {}),
        ...(typeof enabled === 'boolean' ? { enabled } : {}),
      });
      return createCorsResponse({ templates });
    }

    if (request.method === 'POST') {
      const body = (await request.json()) as Partial<
        Omit<TripTemplate, 'id' | 'createdAt' | 'updatedAt'>
      >;

      if (!body?.name || !body?.region || !Array.isArray(body?.presetCities)) {
        return createCorsResponse(
          { error: 'Missing required fields: name, region, presetCities' },
          400
        );
      }

      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(body.region)) {
        return createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400
        );
      }

      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      const template = await createTripTemplate({
        name: String(body.name).trim(),
        region: body.region,
        description: String(body.description || '').trim(),
        icon: String(body.icon || '').trim(),
        imageUrl: String(body.imageUrl || '').trim(),
        presetCities: Array.isArray(body.presetCities) ? body.presetCities.map(c => String(c).trim()) : [],
        tags: Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()) : [],
        enabled: body.enabled ?? true,
        order: typeof body.order === 'number' && Number.isFinite(body.order) ? body.order : 0,
      });

      return createCorsResponse({ template }, 201);
    }

    return createCorsResponse({ error: 'Method not allowed' }, 405);
  } catch (error: any) {
    context.log(
      `Error processing trip templates request: ${error instanceof Error ? error.message : String(error)}`
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

app.http('trip-templates', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: tripTemplates,
});

