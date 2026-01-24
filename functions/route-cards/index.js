"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeCards = routeCards;
const cors_1 = require("../shared/cors");
const cosmos_1 = require("../shared/cosmos");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function routeCards(context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: cors_1.corsHeaders,
        };
        return;
    }
    try {
        if (req.method === 'GET') {
            const regionParam = req.query.region;
            const enabledParam = req.query.enabled;
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            const region = regionParam && validRegions.includes(regionParam)
                ? regionParam
                : undefined;
            const enabled = enabledParam === null || enabledParam === undefined
                ? undefined
                : enabledParam === 'true'
                    ? true
                    : false;
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ routeCards: [] });
                return;
            }
            const routeCards = await (0, cosmos_1.getRouteCards)({
                ...(region ? { region } : {}),
                ...(typeof enabled === 'boolean' ? { enabled } : {}),
            });
            context.res = (0, cors_1.createCorsResponse)({ routeCards });
            return;
        }
        if (req.method === 'POST') {
            const body = req.body;
            if (!body?.name || !body?.region) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name, region' }, 400);
                return;
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(body.region)) {
                context.res = (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400);
                return;
            }
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const routeCard = await (0, cosmos_1.createRouteCard)({
                name: String(body.name).trim(),
                region: body.region,
                tagline: String(body.tagline || '').trim(),
                icon: String(body.icon || '').trim(),
                imageUrl: String(body.imageUrl || '').trim(),
                budget: String(body.budget || '').trim(),
                budgetLabel: String(body.budgetLabel || '').trim(),
                timezone: String(body.timezone || '').trim(),
                vibe: String(body.vibe || '').trim(),
                overview: String(body.overview || '').trim(),
                featuredCities: Array.isArray(body.featuredCities) ? body.featuredCities.map(c => String(c).trim()) : [],
                enabled: body.enabled ?? true,
                order: typeof body.order === 'number' && Number.isFinite(body.order) ? body.order : 0,
            });
            context.res = (0, cors_1.createCorsResponse)({ routeCard }, 201);
            return;
        }
        context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        return;
    }
    catch (error) {
        context.log(`Error processing route cards request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }, 500);
        return;
    }
}
module.exports = { routeCards };
