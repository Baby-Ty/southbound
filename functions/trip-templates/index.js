"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripTemplates = tripTemplates;
const cors_1 = require("../shared/cors");
const cosmos_1 = require("../shared/cosmos");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function tripTemplates(request, context) {
    const origin = request.headers.get('origin');
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: (0, cors_1.getCorsHeaders)(origin),
        };
    }
    try {
        if (request.method === 'GET') {
            const regionParam = request.query.get('region');
            const enabledParam = request.query.get('enabled');
            const curatedParam = request.query.get('curated');
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            const region = regionParam && validRegions.includes(regionParam)
                ? regionParam
                : undefined;
            const enabled = enabledParam === null || enabledParam === undefined
                ? undefined
                : enabledParam === 'true'
                    ? true
                    : false;
            const isCurated = curatedParam === null || curatedParam === undefined
                ? undefined
                : curatedParam === 'true'
                    ? true
                    : false;
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ templates: [] }, 200, origin);
            }
            const templates = await (0, cosmos_1.getTripTemplates)({
                ...(region ? { region } : {}),
                ...(typeof enabled === 'boolean' ? { enabled } : {}),
                ...(typeof isCurated === 'boolean' ? { isCurated } : {}),
            });
            return (0, cors_1.createCorsResponse)({ templates }, 200, origin);
        }
        if (request.method === 'POST') {
            const body = (await request.json());
            if (!body?.name || !body?.region || !Array.isArray(body?.presetCities)) {
                return (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name, region, presetCities' }, 400, origin);
            }
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (!validRegions.includes(body.region)) {
                return (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400, origin);
            }
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500, origin);
            }
            const template = await (0, cosmos_1.createTripTemplate)({
                name: String(body.name).trim(),
                region: body.region,
                description: String(body.description || '').trim(),
                icon: String(body.icon || '').trim(),
                imageUrl: String(body.imageUrl || '').trim(),
                presetCities: Array.isArray(body.presetCities) ? body.presetCities.map(c => String(c).trim()) : [],
                tags: Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()) : [],
                enabled: body.enabled ?? true,
                order: typeof body.order === 'number' && Number.isFinite(body.order) ? body.order : 0,
            });
            return (0, cors_1.createCorsResponse)({ template }, 201, origin);
        }
        return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405, origin);
    }
    catch (error) {
        context.log(`Error processing trip templates request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }, 500, origin);
    }
}
module.exports = { tripTemplates };
