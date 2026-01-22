"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const cosmos_1 = require("../shared/cosmos");
const cors_1 = require("../shared/cors");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function routes(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    try {
        if (request.method === 'POST') {
            const body = await request.json();
            const { name, email, region, stops, preferences, notes } = body;
            if (!name || !email || !region || !stops || !preferences) {
                return (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name, email, region, stops, preferences' }, 400);
            }
            if (!name.trim()) {
                return (0, cors_1.createCorsResponse)({ error: 'Name is required' }, 400);
            }
            const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/;
            if (!emailRegex.test(email)) {
                return (0, cors_1.createCorsResponse)({ error: 'Invalid email format' }, 400);
            }
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
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
            return (0, cors_1.createCorsResponse)({ route }, 201);
        }
        else if (request.method === 'GET') {
            const status = request.query.get('status');
            const email = request.query.get('email');
            const region = request.query.get('region');
            const filters = {
                ...(status && { status }),
                ...(email && { email }),
                ...(region && { region }),
            };
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ routes: [] });
            }
            const routes = await (0, cosmos_1.getAllRoutes)(filters);
            return (0, cors_1.createCorsResponse)({ routes });
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        }
    }
    catch (error) {
        context.log(`Error processing routes request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500);
    }
}
module.exports = { routes };
