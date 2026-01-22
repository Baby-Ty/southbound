"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesById = routesById;
const cosmos_1 = require("../shared/cosmos");
const cors_1 = require("../shared/cors");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function routesById(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    const id = request.params.id;
    if (!id) {
        return (0, cors_1.createCorsResponse)({ error: 'Route ID is required' }, 400);
    }
    try {
        if (request.method === 'GET') {
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            const route = await (0, cosmos_1.getRoute)(id);
            if (!route) {
                return (0, cors_1.createCorsResponse)({ error: 'Route not found' }, 404);
            }
            return (0, cors_1.createCorsResponse)({ route });
        }
        else if (request.method === 'PATCH') {
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            const body = await request.json();
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
            return (0, cors_1.createCorsResponse)({ route });
        }
        else if (request.method === 'DELETE') {
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            await (0, cosmos_1.deleteRoute)(id);
            return (0, cors_1.createCorsResponse)({ success: true });
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        }
    }
    catch (error) {
        context.log(`Error processing route request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
    }
}
module.exports = { routesById };
