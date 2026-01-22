"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTrips = defaultTrips;
const cors_1 = require("../shared/cors");
const cosmos_1 = require("../shared/cosmos");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function defaultTrips(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    try {
        if (request.method === 'GET') {
            const region = request.query.get('region') || undefined;
            const enabledParam = request.query.get('enabled');
            const enabled = enabledParam === null || enabledParam === undefined
                ? undefined
                : enabledParam === 'true'
                    ? true
                    : false;
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ trips: [] });
            }
            const trips = await (0, cosmos_1.getDefaultTrips)({
                ...(region ? { region } : {}),
                ...(typeof enabled === 'boolean' ? { enabled } : {}),
            });
            return (0, cors_1.createCorsResponse)({ trips });
        }
        if (request.method === 'POST') {
            const body = (await request.json());
            if (!body?.name || !body?.region || !Array.isArray(body?.stops)) {
                return (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name, region, stops' }, 400);
            }
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            const trip = await (0, cosmos_1.createDefaultTrip)({
                name: String(body.name).trim(),
                region: String(body.region),
                enabled: body.enabled ?? true,
                order: typeof body.order === 'number' && Number.isFinite(body.order) ? body.order : 0,
                stops: body.stops,
                notes: body.notes ? String(body.notes) : undefined,
            });
            return (0, cors_1.createCorsResponse)({ trip }, 201);
        }
        return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
    }
    catch (error) {
        context.log(`Error processing default trips request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }, 500);
    }
}
module.exports = { defaultTrips };
