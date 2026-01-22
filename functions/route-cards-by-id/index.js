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
async function routeCardsById(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    const id = request.params.id;
    if (!id) {
        return (0, cors_1.createCorsResponse)({ error: 'Route card ID is required' }, 400);
    }
    try {
        if (!isCosmosDBConfigured()) {
            return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
        }
        if (request.method === 'GET') {
            // For GET, we need region from query params since it's the partition key
            const region = request.query.get('region');
            if (!region) {
                return (0, cors_1.createCorsResponse)({ error: 'Region query parameter is required' }, 400);
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(region)) {
                return (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400);
            }
            const routeCard = await (0, cosmos_1.getRouteCard)(id, region);
            if (!routeCard)
                return (0, cors_1.createCorsResponse)({ error: 'Not found' }, 404);
            return (0, cors_1.createCorsResponse)({ routeCard });
        }
        if (request.method === 'PATCH') {
            const body = (await request.json());
            const region = body.region || request.query.get('region');
            if (!region) {
                return (0, cors_1.createCorsResponse)({ error: 'Region is required (in body or query)' }, 400);
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(region)) {
                return (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400);
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
            return (0, cors_1.createCorsResponse)({ routeCard });
        }
        if (request.method === 'DELETE') {
            const region = request.query.get('region');
            if (!region) {
                return (0, cors_1.createCorsResponse)({ error: 'Region query parameter is required' }, 400);
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(region)) {
                return (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400);
            }
            await (0, cosmos_1.deleteRouteCard)(id, region);
            return (0, cors_1.createCorsResponse)({ success: true });
        }
        return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
    }
    catch (error) {
        context.log(`Error processing route card request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
    }
}
module.exports = { routeCardsById };
