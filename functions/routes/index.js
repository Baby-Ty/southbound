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
async function routesHandler(context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: cors_1.corsHeaders,
        };
        return;
    }
    try {
        if (req.method === 'POST') {
            const body = req.body;
            const { name, email, region, stops, preferences, notes } = body;
            if (!name || !email || !region || !stops || !preferences) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name, email, region, stops, preferences' }, 400);
                return;
            }
            if (!name.trim()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Name is required' }, 400);
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/;
            if (!emailRegex.test(email)) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Invalid email format' }, 400);
                return;
            }
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const route = await (0, cosmos_1.saveRoute)({
                name: name.trim(),
                email,
                region,
                stops,
                preferences,
                status: 'draft',
                notes: notes || '',
            });
            context.res = (0, cors_1.createCorsResponse)({ route }, 201);
            return;
        }
        else if (req.method === 'GET') {
            const status = req.query.status;
            const email = req.query.email;
            const region = req.query.region;
            const filters = {
                ...(status && { status }),
                ...(email && { email }),
                ...(region && { region }),
            };
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ routes: [] });
                return;
            }
            const routes = await (0, cosmos_1.getAllRoutes)(filters);
            context.res = (0, cors_1.createCorsResponse)({ routes });
            return;
        }
        else {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
            return;
        }
    }
    catch (error) {
        context.log(`Error processing routes request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500);
        return;
    }
}
// Export for Azure Functions v3 runtime
module.exports = { routesHandler };
