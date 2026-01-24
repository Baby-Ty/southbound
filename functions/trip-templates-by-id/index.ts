import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { corsHeaders, createCorsResponse } from '../shared/cors';
import {
  deleteTripTemplate,
  getTripTemplateById,
  updateTripTemplate,
  TripTemplate,
} from '../shared/cosmos';

function isCosmosDBConfigured(): boolean {
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

export async function tripTemplatesById(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  const id = req.params.id;
  if (!id) {
    (context as any).res = createCorsResponse({ error: 'Trip template ID is required' }, 400); return;
  }

  try {
    if (!isCosmosDBConfigured()) {
      (context as any).res = createCorsResponse({ error: 'CosmosDB is not configured' }, 500); return;
    }

    if (req.method === 'GET') {
      // For GET, we need region from query params since it's the partition key
      const region = (req.query as any).region;
      if (!region) {
        (context as any).res = createCorsResponse({ error: 'Region query parameter is required' }, 400); return;
      }
      
      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(region)) {
        (context as any).res = createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400
        ); return;
      }

      const template = await getTripTemplateById(id, region);
      if (!template) (context as any).res = createCorsResponse({ error: 'Not found' }, 404); return;
      (context as any).res = createCorsResponse({ template }); return;
    }

    if (req.method === 'PATCH') {
      const body = req.body as Partial<TripTemplate>;
      const region = body.region || (req.query as any).region;
      
      context.log(`[PATCH] Updating template ${id} in region ${region}`);
      context.log('[PATCH] Body received:', JSON.stringify(body, null, 2));
      context.log(`[PATCH] Body keys:`, Object.keys(body));
      context.log(`[PATCH] body.isCurated:`, body.isCurated, `(type: ${typeof body.isCurated}, in body: ${'isCurated' in body})`);
      context.log(`[PATCH] body.curatedOrder:`, body.curatedOrder, `(type: ${typeof body.curatedOrder}, in body: ${'curatedOrder' in body})`);
      
      if (!region) {
        (context as any).res = createCorsResponse({ error: 'Region is required (in body or query)' }, 400); return;
      }

      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(region)) {
        (context as any).res = createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400
        ); return;
      }

      const allowed: Partial<Omit<TripTemplate, 'id' | 'createdAt' | 'updatedAt' | 'region'>> = {};

      if (body.name !== undefined) allowed.name = String(body.name).trim();
      if (body.description !== undefined) allowed.description = String(body.description).trim();
      if (body.icon !== undefined) allowed.icon = String(body.icon).trim();
      if (body.imageUrl !== undefined) allowed.imageUrl = String(body.imageUrl).trim();
      if (body.presetCities !== undefined) {
        allowed.presetCities = Array.isArray(body.presetCities)
          ? body.presetCities.map(c => String(c).trim())
          : [];
      }
      if (body.tags !== undefined) {
        allowed.tags = Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()) : [];
      }
      if (body.story !== undefined) allowed.story = String(body.story).trim();
      if (body.enabled !== undefined) allowed.enabled = !!body.enabled;
      if (body.order !== undefined) allowed.order = Number(body.order) || 0;
      // Handle isCurated - explicitly check for presence in body
      if ('isCurated' in body) {
        // Handle boolean, string, or number values
        let isCuratedValue: boolean;
        const isCuratedRaw = body.isCurated as any;
        if (typeof isCuratedRaw === 'boolean') {
          isCuratedValue = isCuratedRaw;
        } else if (typeof isCuratedRaw === 'string') {
          isCuratedValue = isCuratedRaw.toLowerCase() === 'true';
        } else if (typeof isCuratedRaw === 'number') {
          isCuratedValue = isCuratedRaw === 1;
        } else {
          isCuratedValue = Boolean(isCuratedRaw);
        }
        allowed.isCurated = isCuratedValue;
        context.log(`[PATCH] Set isCurated: ${allowed.isCurated} (type: ${typeof allowed.isCurated}, from: ${body.isCurated})`);
      }
      
      // Handle curatedOrder - explicitly check for presence in body
      if ('curatedOrder' in body) {
        if (body.curatedOrder === null) {
          // Explicitly clear the field
          allowed.curatedOrder = undefined;
          context.log(`[PATCH] Clearing curatedOrder (received null)`);
        } else if (body.curatedOrder !== undefined) {
          const order = typeof body.curatedOrder === 'number' 
            ? body.curatedOrder 
            : Number(body.curatedOrder);
          if (!isNaN(order) && order > 0) {
            allowed.curatedOrder = order;
            context.log(`[PATCH] Set curatedOrder: ${allowed.curatedOrder} (from: ${body.curatedOrder})`);
          } else {
            context.log(`[PATCH] Invalid curatedOrder value: ${body.curatedOrder}, skipping`);
          }
        }
      }
      if (body.curatedImageUrl !== undefined) {
        const trimmed = String(body.curatedImageUrl).trim();
        allowed.curatedImageUrl = trimmed === '' ? undefined : trimmed;
      }
      // Homepage card display fields
      if (body.price !== undefined) {
        const trimmed = String(body.price).trim();
        allowed.price = trimmed === '' ? undefined : trimmed;
      }
      if (body.vibe !== undefined) {
        const trimmed = String(body.vibe).trim();
        allowed.vibe = trimmed === '' ? undefined : trimmed;
      }
      if (body.internetSpeed !== undefined) {
        const trimmed = String(body.internetSpeed).trim();
        allowed.internetSpeed = trimmed === '' ? undefined : trimmed;
      }
      if (body.safetyRating !== undefined) {
        const trimmed = String(body.safetyRating).trim();
        allowed.safetyRating = trimmed === '' ? undefined : trimmed;
      }
      if (body.avgWeather !== undefined) {
        const trimmed = String(body.avgWeather).trim();
        allowed.avgWeather = trimmed === '' ? undefined : trimmed;
      }
      if (body.bestFor !== undefined) {
        const trimmed = String(body.bestFor).trim();
        allowed.bestFor = trimmed === '' ? undefined : trimmed;
      }

      // CRITICAL: Final safety check - ensure fields are in allowed if they're in body
      if ('isCurated' in body) {
        if (!('isCurated' in allowed)) {
          context.log(`[PATCH] WARNING: isCurated was in body but not set in allowed! Forcing...`);
        }
        // Force set it regardless
        const isCuratedRaw = body.isCurated as any;
        const isCuratedValue = typeof isCuratedRaw === 'boolean' 
          ? isCuratedRaw 
          : (typeof isCuratedRaw === 'string' ? isCuratedRaw.toLowerCase() === 'true' : Boolean(isCuratedRaw));
        allowed.isCurated = isCuratedValue;
        context.log(`[PATCH] FORCED isCurated: ${allowed.isCurated}`);
      }
      
      if ('curatedOrder' in body) {
        if (body.curatedOrder === null) {
          // Explicitly clear the field
          if (!('curatedOrder' in allowed)) {
            context.log(`[PATCH] WARNING: curatedOrder was in body but not set in allowed! Forcing clear...`);
          }
          allowed.curatedOrder = undefined;
          context.log(`[PATCH] FORCED clear curatedOrder`);
        } else if (body.curatedOrder !== null && body.curatedOrder !== undefined) {
          if (!('curatedOrder' in allowed)) {
            context.log(`[PATCH] WARNING: curatedOrder was in body but not set in allowed! Forcing...`);
          }
          // Force set it regardless
          const order = typeof body.curatedOrder === 'number' ? body.curatedOrder : Number(body.curatedOrder);
          if (!isNaN(order) && order > 0) {
            allowed.curatedOrder = order;
            context.log(`[PATCH] FORCED curatedOrder: ${allowed.curatedOrder}`);
          }
        }
      }
      
      context.log('[PATCH] Final allowed updates:', JSON.stringify(allowed, null, 2));
      context.log(`[PATCH] Final allowed keys:`, Object.keys(allowed));
      context.log(`[PATCH] Final allowed.isCurated:`, allowed.isCurated, `(type: ${typeof allowed.isCurated})`);
      context.log(`[PATCH] Final allowed.curatedOrder:`, allowed.curatedOrder, `(type: ${typeof allowed.curatedOrder})`);

      if (Object.keys(allowed).length === 0) {
        context.log('[PATCH] No updates to apply, returning existing template');
        const existing = await getTripTemplateById(id, region);
        if (!existing) (context as any).res = createCorsResponse({ error: 'Template not found' }, 404); return;
        (context as any).res = createCorsResponse({ template: existing }); return;
      }

      try {
        const template = await updateTripTemplate(id, region, allowed);
        
        context.log('[PATCH] Updated template:', JSON.stringify(template, null, 2));
        context.log(`[PATCH] Successfully updated template ${id} - isCurated: ${template.isCurated}, curatedOrder: ${template.curatedOrder}`);
        
        (context as any).res = createCorsResponse({ template }); return;
      } catch (updateError: any) {
        context.log(`[PATCH] Error updating template ${id}:`, updateError.message);
        context.log(`[PATCH] Error stack:`, updateError.stack);
        (context as any).res = createCorsResponse(
          { 
            error: updateError.message || 'Failed to update template',
            details: process.env.NODE_ENV === 'development' ? updateError.stack : undefined
          },
          500
        ); return;
      }
    }

    if (req.method === 'DELETE') {
      const region = (req.query as any).region;
      if (!region) {
        (context as any).res = createCorsResponse({ error: 'Region query parameter is required' }, 400); return;
      }

      const validRegions = ['europe', 'latin-america', 'southeast-asia'];
      if (!validRegions.includes(region)) {
        (context as any).res = createCorsResponse(
          { error: `Invalid region. Must be one of: ${validRegions.join(', ')}` },
          400
        ); return;
      }

      await deleteTripTemplate(id, region);
      (context as any).res = createCorsResponse({ success: true }); return;
    }

    (context as any).res = createCorsResponse({ error: 'Method not allowed' }, 405); return;
  } catch (error: any) {
    context.log(
      `Error processing trip template request: ${error instanceof Error ? error.message : String(error)}`
    );
    (context as any).res = createCorsResponse(
      { error: error.message || 'Failed to process request' },
      500
    ); return;
  }
}

module.exports = { tripTemplatesById };
