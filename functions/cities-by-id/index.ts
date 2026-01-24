import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCity, updateCity, deleteCity } from '../shared/cosmos-cities';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function citiesById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  const id = req.params.id;

  if (!id) {
    (context as any).res = createCorsResponse({ error: 'City ID is required' }, 400); return;
  }

  try {
    if (req.method === 'GET') {
      const city = await getCity(id);
      
      if (!city) {
        (context as any).res = createCorsResponse({ error: 'City not found' }, 404); return;
      }

      (context as any).res = createCorsResponse({ city }); return;
    } else if (req.method === 'PATCH') {
      const body = req.body as any;
      const city = await updateCity(id, body);
      (context as any).res = createCorsResponse({ city }); return;
    } else if (req.method === 'DELETE') {
      await deleteCity(id);
      (context as any).res = createCorsResponse({ success: true }); return;
    } else {
      (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
    }
  } catch (error: any) {
    context.log(`Error processing city request: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    ); return;
  }
}

module.exports = { citiesById };
