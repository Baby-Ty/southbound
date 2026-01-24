import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { corsHeaders, createCorsResponse } from '../shared/cors';
import { createRouteCard, getRouteCards, RouteCard } from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function routeCards(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    if (req.method === 'GET') {
      const regionParam = (req.query as any).region;
      const enabledParam = (req.query as any).enabled;
      
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
        return createCorsResponse({ routeCards: [] });
      }

      const routeCards = await getRouteCards({
        ...(region ? { region } : {}),
        ...(typeof enabled === 'boolean' ? { enabled } : {}),
      });
      return createCorsResponse({ routeCards });
    }

    if (req.method === 'POST') {
      const body = req.body as Partial<
        Omit<RouteCard, 'id' | 'createdAt' | 'updatedAt'>
      >;

      if (!body?.name || !body?.region) {
        return createCorsResponse(
          { error: 'Missing required fields: name, region' },
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

      const routeCard = await createRouteCard({
        name: String(body.name).trim(),
        region: body.region,
        tagline: String(body.tagline || '').trim(),
        icon: String(body.icon || '').trim(),
        imageUrl: String(body.imageUrl || '').trim(),
        budget: String(body.budget || '').trim(),
        budgetLabel: String(body.budgetLabel || '').trim(),
        timezone: String(body.timezone || '').trim(),
        vibe: String(body.vibe || '').trim(),
        overview: String(body.overview || '').trim(),
        featuredCities: Array.isArray(body.featuredCities) ? body.featuredCities.map(c => String(c).trim()) : [],
        enabled: body.enabled ?? true,
        order: typeof body.order === 'number' && Number.isFinite(body.order) ? body.order : 0,
      });

      return createCorsResponse({ routeCard }, 201);
    }

    return createCorsResponse({ error: 'Method not allowed' }, 405);
  } catch (error: any) {
    context.log(
      `Error processing route cards request: ${error instanceof Error ? error.message : String(error)}`
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

module.exports = { routeCards };