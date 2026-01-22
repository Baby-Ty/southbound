import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getAllCountries, saveCountry } from '../shared/cosmos-countries';
import { getCorsHeaders, createCorsResponse } from '../shared/cors';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function countries(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    if (request.method === 'GET') {
      const region = request.query.get('region');

      // Validate region if provided
      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (region && !validRegions.includes(region)) {
        return createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400,
          origin
        );
      }

      if (!isCosmosDBConfigured()) {
        context.log('[countries] CosmosDB not configured, returning empty array');
        return createCorsResponse({ countries: [] }, 200, origin);
      }

      const countries = await getAllCountries(region || undefined);
      context.log(`[countries] Retrieved ${countries.length} countries${region ? ` for region: ${region}` : ''}`);
      
      return createCorsResponse({ countries }, 200, origin);
    } else if (request.method === 'POST') {
      if (!isCosmosDBConfigured()) {
        return createCorsResponse(
          { error: 'CosmosDB not configured' },
          500,
          origin
        );
      }

      const body = await request.json() as any;
      const country = await saveCountry(body);
      context.log(`[countries] Created country: ${country.name}`);
      
      return createCorsResponse({ country }, 201, origin);
    } else {
      return createCorsResponse({ error: 'Method not allowed' }, 405, origin);
    }
  } catch (error: any) {
    context.log(`[countries] Error processing countries request: ${error instanceof Error ? error.message : String(error)}`);
    
    // If CosmosDB isn't configured or there's a connection issue, return empty array instead of error
    if (error.message?.includes('CosmosDB') || error.message?.includes('not configured') || error.message?.includes('connect')) {
      context.log('[countries] CosmosDB issue detected, returning empty array');
      return createCorsResponse({ countries: [] }, 200, origin);
    }
    
    return createCorsResponse(
      { 
        error: error.message || 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500,
      origin
    );
  }
}

module.exports = { countries };