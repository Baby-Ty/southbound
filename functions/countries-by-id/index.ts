import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCountry, updateCountry, deleteCountry } from '../shared/cosmos-countries';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function countriesById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  const id = req.params.id;

  if (!id) {
    (context as any).res = createCorsResponse({ error: 'Country ID is required' }, 400); return;
  }

  try {
    if (req.method === 'GET') {
      const country = await getCountry(id);
      
      if (!country) {
        (context as any).res = createCorsResponse({ error: 'Country not found' }, 404); return;
      }

      (context as any).res = createCorsResponse({ country }); return;
    } else if (req.method === 'PATCH') {
      const body = req.body as any;
      const country = await updateCountry(id, body);
      context.log(`[countries-by-id] Updated country: ${country.name}`);
      (context as any).res = createCorsResponse({ country }); return;
    } else if (req.method === 'DELETE') {
      await deleteCountry(id);
      context.log(`[countries-by-id] Deleted country: ${id}`);
      (context as any).res = createCorsResponse({ success: true }); return;
    } else {
      (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
    }
  } catch (error: any) {
    context.log(`[countries-by-id] Error processing country request: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    ); return;
  }
}

module.exports = { countriesById };