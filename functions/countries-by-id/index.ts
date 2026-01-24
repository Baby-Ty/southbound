import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCountry, updateCountry, deleteCountry } from '../shared/cosmos-countries';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function countriesById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = req.params.id;

  if (!id) {
    return createCorsResponse({ error: 'Country ID is required' }, 400);
  }

  try {
    if (req.method === 'GET') {
      const country = await getCountry(id);
      
      if (!country) {
        return createCorsResponse({ error: 'Country not found' }, 404);
      }

      return createCorsResponse({ country });
    } else if (req.method === 'PATCH') {
      const body = req.body as any;
      const country = await updateCountry(id, body);
      context.log(`[countries-by-id] Updated country: ${country.name}`);
      return createCorsResponse({ country });
    } else if (req.method === 'DELETE') {
      await deleteCountry(id);
      context.log(`[countries-by-id] Deleted country: ${id}`);
      return createCorsResponse({ success: true });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log(`[countries-by-id] Error processing country request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

module.exports = { countriesById };