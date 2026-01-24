"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cosmos_1 = require("../shared/cosmos");
const cors_1 = require("../shared/cors");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function routesByIdHandler(context, req) {
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
        context.res = (0, cors_1.createCorsResponse)({ error: 'Route ID is required' }, 400);
        return;
    }
    try {
        if (req.method === 'GET') {
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const route = await (0, cosmos_1.getRoute)(id);
            if (!route) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Route not found' }, 404);
                return;
            }
            context.res = (0, cors_1.createCorsResponse)({ route });
            return;
        }
        else if (req.method === 'PATCH') {
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const body = req.body;
            const allowedUpdates = {};
            if (body.status !== undefined) {
                allowedUpdates.status = body.status;
            }
            if (body.stops !== undefined) {
                allowedUpdates.stops = body.stops;
            }
            if (body.preferences !== undefined) {
                allowedUpdates.preferences = body.preferences;
            }
            if (body.notes !== undefined) {
                allowedUpdates.notes = body.notes;
            }
            if (body.adminNotes !== undefined) {
                allowedUpdates.adminNotes = body.adminNotes;
            }
            const route = await (0, cosmos_1.updateRoute)(id, allowedUpdates);
            context.res = (0, cors_1.createCorsResponse)({ route });
            return;
        }
        else if (req.method === 'DELETE') {
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            await (0, cosmos_1.deleteRoute)(id);
            context.res = (0, cors_1.createCorsResponse)({ success: true });
            return;
        }
        else {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
            return;
        }
    }
    catch (error) {
        context.log(`Error processing route request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
        return;
    }
}
// Export for Azure Functions v3 runtime
module.exports = { routesByIdHandler };
