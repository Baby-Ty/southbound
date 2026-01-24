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
    return {
      status: 204,
      headers: corsHeaders,
    };
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
        return createCorsResponse(
          { error: 'Missing required fields: name and destination are required' },
          400
        );
      }

      if (!name.trim()) {
        return createCorsResponse(
          { error: 'Name is required' },
          400
        );
      }

      if (!isCosmosDBConfigured()) {
        return createCorsResponse(
          { error: 'CosmosDB is not configured' },
          500
        );
      }

      const lead = await saveLead({
        name: name.trim(),
        destination: destination.trim(),
        stage: stage || 'New',
        notes: notes || '',
        lastContact: lastContact || new Date().toISOString(),
      });

      return createCorsResponse({ lead }, 201);
    } else if (req.method === 'GET') {
      const stage = (req.query as any).stage as Lead['stage'] | undefined;
      const destination = (req.query as any).destination as string | undefined;

      const filters: any = {};
      if (stage) filters.stage = stage;
      if (destination) filters.destination = destination;

      if (!isCosmosDBConfigured()) {
        return createCorsResponse({ leads: [] });
      }

      const leads = await getAllLeads(filters);
      return createCorsResponse({ leads });
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error: any) {
    context.log(`Error processing leads request: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  }
}

module.exports = { leads };
