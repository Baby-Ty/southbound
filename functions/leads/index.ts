import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
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

export async function leads(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    if (request.method === 'POST') {
      const body = await request.json() as {
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
    } else if (request.method === 'GET') {
      const stage = request.query.get('stage') as Lead['stage'] | null;
      const destination = request.query.get('destination');

      const filters = {
        ...(stage && { stage }),
        ...(destination && { destination }),
      };

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

app.http('leads', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: leads,
});

