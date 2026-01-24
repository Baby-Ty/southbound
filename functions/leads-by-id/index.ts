import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getLead, updateLead, deleteLead, Lead } from '../shared/cosmos';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function leadsById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  const id = req.params.id;

  if (!id) {
    return createCorsResponse({ error: 'Lead ID is required' }, 400);
  }

  try {
    if (req.method === 'GET') {
      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      const lead = await getLead(id);
      
      if (!lead) {
        return createCorsResponse({ error: 'Lead not found' }, 404);
      }

      return createCorsResponse({ lead });
    } else if (req.method === 'PATCH') {
      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      const body = req.body as Partial<Lead>;
      
      const lead = await updateLead(id, body);
      return createCorsResponse({ lead });
    } else if (req.method === 'DELETE') {
      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ error: 'CosmosDB is not configured' }, 500);
      }

      await deleteLead(id);
      return createCorsResponse({ success: true });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log(`Error processing lead request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    );
  }
}

module.exports = { leadsById };
