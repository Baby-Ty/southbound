import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { corsHeaders, createCorsResponse } from '../shared/cors';
import {
  deleteRouteCard,
  getRouteCard,
  updateRouteCard,
  RouteCard,
} from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function routeCardsById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = req.params.id;
  if (!id) {
    return createCorsResponse({ error: 'Route card ID is required' }, 400);
  }

  try {
    if (!isCosmosDBConfigured()) {
      return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
    }

    if (req.method === 'GET') {
      // For GET, we need region from query params since it's the partition key
      const region = (req.query as any).region;
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

      const routeCard = await getRouteCard(id, region);
      if (!routeCard) return createCorsResponse({ error: 'Not found' }, 404);
      return createCorsResponse({ routeCard });
    }

    if (req.method === 'PATCH') {
      const body = req.body as Partial<RouteCard>;
      const region = body.region || (req.query as any).region;
      
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

      const allowed: Partial<Omit<RouteCard, 'id' | 'createdAt' | 'updatedAt' | 'region'>> = {};

      if (body.name !== undefined) allowed.name = String(body.name).trim();
      if (body.tagline !== undefined) allowed.tagline = String(body.tagline).trim();
      if (body.icon !== undefined) allowed.icon = String(body.icon).trim();
      if (body.imageUrl !== undefined) allowed.imageUrl = String(body.imageUrl).trim();
      if (body.budget !== undefined) allowed.budget = String(body.budget).trim();
      if (body.budgetLabel !== undefined) allowed.budgetLabel = String(body.budgetLabel).trim();
      if (body.timezone !== undefined) allowed.timezone = String(body.timezone).trim();
      if (body.vibe !== undefined) allowed.vibe = String(body.vibe).trim();
      if (body.overview !== undefined) allowed.overview = String(body.overview).trim();
      if (body.featuredCities !== undefined) {
        allowed.featuredCities = Array.isArray(body.featuredCities)
          ? body.featuredCities.map(c => String(c).trim())
          : [];
      }
      if (body.enabled !== undefined) allowed.enabled = !!body.enabled;
      if (body.order !== undefined) allowed.order = Number(body.order) || 0;

      const routeCard = await updateRouteCard(id, region, allowed);
      return createCorsResponse({ routeCard });
    }

    if (req.method === 'DELETE') {
      const region = (req.query as any).region;
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

      await deleteRouteCard(id, region);
      return createCorsResponse({ success: true });
    }

    return createCorsResponse({ error: 'Method not allowed' }, 405);
  } catch (error: any) {
    context.log(
      `Error processing route card request: ${error instanceof Error ? error.message : String(error)}`
    );
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

module.exports = { routeCardsById };