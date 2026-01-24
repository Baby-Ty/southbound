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
async function defaultTrips(context, req) {
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
            const region = req.query.region || undefined;
            const enabledParam = req.query.enabled;
            const enabled = enabledParam === null || enabledParam === undefined
                ? undefined
                : enabledParam === 'true'
                    ? true
                    : false;
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ trips: [] });
                return;
            }
            const trips = await (0, cosmos_1.getDefaultTrips)({
                ...(region ? { region } : {}),
                ...(typeof enabled === 'boolean' ? { enabled } : {}),
            });
            context.res = (0, cors_1.createCorsResponse)({ trips });
            return;
        }
        if (req.method === 'POST') {
            const body = req.body;
            if (!body?.name || !body?.region || !Array.isArray(body?.stops)) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name, region, stops' }, 400);
                return;
            }
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const trip = await (0, cosmos_1.createDefaultTrip)({
                name: String(body.name).trim(),
                region: String(body.region),
                enabled: body.enabled ?? true,
                order: typeof body.order === 'number' && Number.isFinite(body.order) ? body.order : 0,
                stops: body.stops,
                notes: body.notes ? String(body.notes) : undefined,
            });
            context.res = (0, cors_1.createCorsResponse)({ trip }, 201);
            return;
        }
        context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        return;
    }
    catch (error) {
        context.log(`Error processing default trips request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }, 500);
        return;
    }
}
module.exports = { defaultTrips };
