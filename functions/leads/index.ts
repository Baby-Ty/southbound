import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { saveLead, getAllLeads, Lead } from '../shared/cosmos';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function leads(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  try {
    if (req.method === 'POST') {
      const body = req.body as {
        name?: string;
        destination?: string;
        stage?: Lead['stage'];
        notes?: string;
        lastContact?: string;
      };
      
      const { name, destination, stage, notes, lastContact } = body;

      if (!name || !destination) {
        (context as any).res = createCorsResponse(
          { error: 'Missing required fields: name and destination are required' },
          400
        ); return;
      }

      if (!name.trim()) {
        (context as any).res = createCorsResponse(
          { error: 'Name is required' },
          400
        ); return;
      }

      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse(
          { error: 'CosmosDB is not configured' },
          500
        ); return;
      }

      const lead = await saveLead({
        name: name.trim(),
        destination: destination.trim(),
        stage: stage || 'New',
        notes: notes || '',
        lastContact: lastContact || new Date().toISOString(),
      });

      (context as any).res = createCorsResponse({ lead }, 201); return;
    } else if (req.method === 'GET') {
      const stage = (req.query as any).stage as Lead['stage'] | undefined;
      const destination = (req.query as any).destination as string | undefined;

      const filters: any = {};
      if (stage) filters.stage = stage;
      if (destination) filters.destination = destination;

      if (!isCosmosDBConfigured()) {
        (context as any).res = createCorsResponse({ leads: [] }); return;
      }

      const leads = await getAllLeads(filters);
      (context as any).res = createCorsResponse({ leads }); return;
    } else {
      (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
    }
  } catch (error: any) {
    context.log(`Error processing leads request: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    ); return;
  }
}

module.exports = { leads };
