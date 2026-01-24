import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCity, updateCity, deleteCity } from '../shared/cosmos-cities';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function citiesById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = req.params.id;

  if (!id) {
    return createCorsResponse({ error: 'City ID is required' }, 400);
  }

  try {
    if (req.method === 'GET') {
      const city = await getCity(id);
      
      if (!city) {
        return createCorsResponse({ error: 'City not found' }, 404);
      }

      return createCorsResponse({ city });
    } else if (req.method === 'PATCH') {
      const body = req.body as any;
      const city = await updateCity(id, body);
      return createCorsResponse({ city });
    } else if (req.method === 'DELETE') {
      await deleteCity(id);
      return createCorsResponse({ success: true });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log(`Error processing city request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

module.exports = { citiesById };
