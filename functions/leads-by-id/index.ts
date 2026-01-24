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
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  const id = req.params.id;

  if (!id) {
    (context as any).res = createCorsResponse({ error: 'Lead ID is required' }, 400); return;
  }

  try {
    if (req.method === 'GET') {
      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
      }

      const lead = await getLead(id);
      
      if (!lead) {
        (context as any).res = createCorsResponse({ error: 'Lead not found' }, 404); return;
      }

      (context as any).res = createCorsResponse({ lead }); return;
    } else if (req.method === 'PATCH') {
      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
      }

      const body = req.body as Partial<Lead>;
      
      const lead = await updateLead(id, body);
      (context as any).res = createCorsResponse({ lead }); return;
    } else if (req.method === 'DELETE') {
      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
      }

      await deleteLead(id);
      (context as any).res = createCorsResponse({ success: true }); return;
    } else {
      (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
    }
  } catch (error: any) {
    context.log(`Error processing lead request: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    ); return;
  }
}

module.exports = { leadsById };
