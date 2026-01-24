"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeCardsById = routeCardsById;
const cors_1 = require("../shared/cors");
const cosmos_1 = require("../shared/cosmos");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function routeCardsById(context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: cors_1.corsHeaders,
        };
        return;
    }
    const id = req.params.id;
    if (!id) {
        context.res = (0, cors_1.createCorsResponse)({ error: 'Route card ID is required' }, 400);
        return;
    }
    try {
        if (!isCosmosDBConfigured()) {
            context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            return;
        }
        if (req.method === 'GET') {
            // For GET, we need region from query params since it's the partition key
            const region = req.query.region;
            if (!region) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Region query parameter is required' }, 400);
                return;
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(region)) {
                context.res = (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400);
                return;
            }
            const routeCard = await (0, cosmos_1.getRouteCard)(id, region);
            if (!routeCard)
                context.res = (0, cors_1.createCorsResponse)({ error: 'Not found' }, 404);
            return;
            context.res = (0, cors_1.createCorsResponse)({ routeCard });
            return;
        }
        if (req.method === 'PATCH') {
            const body = req.body;
            const region = body.region || req.query.region;
            if (!region) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Region is required (in body or query)' }, 400);
                return;
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(region)) {
                context.res = (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400);
                return;
            }
            const allowed = {};
            if (body.name !== undefined)
                allowed.name = String(body.name).trim();
            if (body.tagline !== undefined)
                allowed.tagline = String(body.tagline).trim();
            if (body.icon !== undefined)
                allowed.icon = String(body.icon).trim();
            if (body.imageUrl !== undefined)
                allowed.imageUrl = String(body.imageUrl).trim();
            if (body.budget !== undefined)
                allowed.budget = String(body.budget).trim();
            if (body.budgetLabel !== undefined)
                allowed.budgetLabel = String(body.budgetLabel).trim();
            if (body.timezone !== undefined)
                allowed.timezone = String(body.timezone).trim();
            if (body.vibe !== undefined)
                allowed.vibe = String(body.vibe).trim();
            if (body.overview !== undefined)
                allowed.overview = String(body.overview).trim();
            if (body.featuredCities !== undefined) {
                allowed.featuredCities = Array.isArray(body.featuredCities)
                    ? body.featuredCities.map(c => String(c).trim())
                    : [];
            }
            if (body.enabled !== undefined)
                allowed.enabled = !!body.enabled;
            if (body.order !== undefined)
                allowed.order = Number(body.order) || 0;
            const routeCard = await (0, cosmos_1.updateRouteCard)(id, region, allowed);
            context.res = (0, cors_1.createCorsResponse)({ routeCard });
            return;
        }
        if (req.method === 'DELETE') {
            const region = req.query.region;
            if (!region) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Region query parameter is required' }, 400);
                return;
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(region)) {
                context.res = (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400);
                return;
            }
            await (0, cosmos_1.deleteRouteCard)(id, region);
            context.res = (0, cors_1.createCorsResponse)({ success: true });
            return;
        }
        context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        return;
    }
    catch (error) {
        context.log(`Error processing route card request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
        return;
    }
}
module.exports = { routeCardsById };
