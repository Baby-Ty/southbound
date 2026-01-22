"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citiesById = citiesById;
const cosmos_cities_1 = require("../shared/cosmos-cities");
const cors_1 = require("../shared/cors");
async function citiesById(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    const id = request.params.id;
    if (!id) {
        return (0, cors_1.createCorsResponse)({ error: 'City ID is required' }, 400);
    }
    try {
        if (request.method === 'GET') {
            const city = await (0, cosmos_cities_1.getCity)(id);
            if (!city) {
                return (0, cors_1.createCorsResponse)({ error: 'City not found' }, 404);
            }
            return (0, cors_1.createCorsResponse)({ city });
        }
        else if (request.method === 'PATCH') {
            const body = await request.json();
            const city = await (0, cosmos_cities_1.updateCity)(id, body);
            return (0, cors_1.createCorsResponse)({ city });
        }
        else if (request.method === 'DELETE') {
            await (0, cosmos_cities_1.deleteCity)(id);
            return (0, cors_1.createCorsResponse)({ success: true });
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        }
    }
    catch (error) {
        context.log(`Error processing city request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
    }
}
module.exports = { citiesById };
