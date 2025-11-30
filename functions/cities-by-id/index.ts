import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCity, updateCity, deleteCity } from '../shared/cosmos-cities';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function citiesById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = request.params.id;

  if (!id) {
    return createCorsResponse({ error: 'City ID is required' }, 400);
  }

  try {
    if (request.method === 'GET') {
      const city = await getCity(id);
      
      if (!city) {
        return createCorsResponse({ error: 'City not found' }, 404);
      }

      return createCorsResponse({ city });
    } else if (request.method === 'PATCH') {
      const body = await request.json();
      const city = await updateCity(id, body);
      return createCorsResponse({ city });
    } else if (request.method === 'DELETE') {
      await deleteCity(id);
      return createCorsResponse({ success: true });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log.error('Error processing city request:', error);
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

app.http('cities-by-id', {
  methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cities/{id}',
  handler: citiesById,
});

