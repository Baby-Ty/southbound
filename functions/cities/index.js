"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cities = cities;
const cosmos_cities_1 = require("../shared/cosmos-cities");
const cors_1 = require("../shared/cors");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function cities(context, req) {
    const origin = req.headers['origin'];
    const corsHeaders = (0, cors_1.getCorsHeaders)(origin);
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return {
            status: 204,
            headers: corsHeaders,
        };
    }
    try {
        if (req.method === 'GET') {
            const region = req.query.region;
            // Validate region if provided
            const validRegions = ['europe', 'latin-america', 'southeast-asia'];
            if (region && !validRegions.includes(region)) {
                return (0, cors_1.createCorsResponse)({ error: `Invalid region. Must be one of: ${validRegions.join(', ')}` }, 400, origin);
            }
            if (!isCosmosDBConfigured()) {
                context.log('[cities] CosmosDB not configured, returning empty array');
                return (0, cors_1.createCorsResponse)({ cities: [] }, 200, origin);
            }
            const cities = await (0, cosmos_cities_1.getAllCities)(region || undefined);
            context.log(`[cities] Retrieved ${cities.length} cities${region ? ` for region: ${region}` : ''}`);
            return (0, cors_1.createCorsResponse)({ cities }, 200, origin);
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405, origin);
        }
    }
    catch (error) {
        context.log(`[cities] Error processing cities request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500, origin);
    }
}
module.exports = { cities };
