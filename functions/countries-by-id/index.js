"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countriesById = countriesById;
const cosmos_countries_1 = require("../shared/cosmos-countries");
const cors_1 = require("../shared/cors");
async function countriesById(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    const id = request.params.id;
    if (!id) {
        return (0, cors_1.createCorsResponse)({ error: 'Country ID is required' }, 400);
    }
    try {
        if (request.method === 'GET') {
            const country = await (0, cosmos_countries_1.getCountry)(id);
            if (!country) {
                return (0, cors_1.createCorsResponse)({ error: 'Country not found' }, 404);
            }
            return (0, cors_1.createCorsResponse)({ country });
        }
        else if (request.method === 'PATCH') {
            const body = await request.json();
            const country = await (0, cosmos_countries_1.updateCountry)(id, body);
            context.log(`[countries-by-id] Updated country: ${country.name}`);
            return (0, cors_1.createCorsResponse)({ country });
        }
        else if (request.method === 'DELETE') {
            await (0, cosmos_countries_1.deleteCountry)(id);
            context.log(`[countries-by-id] Deleted country: ${id}`);
            return (0, cors_1.createCorsResponse)({ success: true });
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        }
    }
    catch (error) {
        context.log(`[countries-by-id] Error processing country request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
    }
}
module.exports = { countriesById };
