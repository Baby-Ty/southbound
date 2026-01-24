import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCorsHeaders, createCorsResponse } from '../shared/cors';
import { createTripTemplate, getTripTemplates, TripTemplate } from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function tripTemplates(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  const origin = req.headers['origin'] as string | null;
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: getCorsHeaders(origin),
    }; return;
  }

  try {
    if (req.method === 'GET') {
      const regionParam = (req.query as any).region;
      const enabledParam = (req.query as any).enabled;
      const curatedParam = (req.query as any).curated;
      
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

      const isCurated =
        curatedParam === null || curatedParam === undefined
          ? undefined
          : curatedParam === 'true'
            ? true
            : false;

      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ templates: [] }, 200, origin); return;
      }

      const templates = await getTripTemplates({
        ...(region ? { region } : {}),
        ...(typeof enabled === 'boolean' ? { enabled } : {}),
        ...(typeof isCurated === 'boolean' ? { isCurated } : {}),
      });
      (context as any).res = createCorsResponse({ templates }, 200, origin); return;
    }

    if (req.method === 'POST') {
      const body = req.body as Partial<
        Omit<TripTemplate, 'id' | 'createdAt' | 'updatedAt'>
      >;

      if (!body?.name || !body?.region || !Array.isArray(body?.presetCities)) {
        (context as any).res = createCorsResponse(
          { error: 'Missing required fields: name, region, presetCities' },
          400,
          origin
        ); return;
      }

      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(body.region)) {
        (context as any).res = createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400,
          origin
        ); return;
      }

      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500, origin); return;
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

      (context as any).res = createCorsResponse({ template }, 201, origin); return;
    }

    (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405, origin); return;
  } catch (error: any) {
    context.log(
      `Error processing trip templates request: ${error instanceof Error ? error.message : String(error)}`
    );
    (context as any).res = createCorsResponse(
      {
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      500,
      origin
    ); return;
  }
}

module.exports = { tripTemplates };
