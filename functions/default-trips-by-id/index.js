"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTripsById = defaultTripsById;
const cors_1 = require("../shared/cors");
const cosmos_1 = require("../shared/cosmos");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function defaultTripsById(context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    const id = req.params.id;
    if (!id) {
        return (0, cors_1.createCorsResponse)({ error: 'Default trip ID is required' }, 400);
    }
    try {
        if (!isCosmosDBConfigured()) {
            return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
        }
        if (req.method === 'GET') {
            const trip = await (0, cosmos_1.getDefaultTripById)(id);
            if (!trip)
                return (0, cors_1.createCorsResponse)({ error: 'Not found' }, 404);
            return (0, cors_1.createCorsResponse)({ trip });
        }
        if (req.method === 'PATCH') {
            const body = req.body;
            const allowed = {};
            if (body.name !== undefined)
                allowed.name = String(body.name);
            if (body.enabled !== undefined)
                allowed.enabled = !!body.enabled;
            if (body.order !== undefined)
                allowed.order = Number(body.order) || 0;
            if (body.stops !== undefined)
                allowed.stops = body.stops;
            if (body.notes !== undefined)
                allowed.notes = body.notes ? String(body.notes) : undefined;
            const trip = await (0, cosmos_1.updateDefaultTrip)(id, allowed);
            return (0, cors_1.createCorsResponse)({ trip });
        }
        if (req.method === 'DELETE') {
            await (0, cosmos_1.deleteDefaultTrip)(id);
            return (0, cors_1.createCorsResponse)({ success: true });
        }
        return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
    }
    catch (error) {
        context.log(`Error processing default trip request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
    }
}
module.exports = { defaultTripsById };
