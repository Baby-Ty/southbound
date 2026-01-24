"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citiesById = citiesById;
const cosmos_cities_1 = require("../shared/cosmos-cities");
const cors_1 = require("../shared/cors");
async function citiesById(context, req) {
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
        context.res = (0, cors_1.createCorsResponse)({ error: 'City ID is required' }, 400);
        return;
    }
    try {
        if (req.method === 'GET') {
            const city = await (0, cosmos_cities_1.getCity)(id);
            if (!city) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'City not found' }, 404);
                return;
            }
            context.res = (0, cors_1.createCorsResponse)({ city });
            return;
        }
        else if (req.method === 'PATCH') {
            const body = req.body;
            const city = await (0, cosmos_cities_1.updateCity)(id, body);
            context.res = (0, cors_1.createCorsResponse)({ city });
            return;
        }
        else if (req.method === 'DELETE') {
            await (0, cosmos_cities_1.deleteCity)(id);
            context.res = (0, cors_1.createCorsResponse)({ success: true });
            return;
        }
        else {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
            return;
        }
    }
    catch (error) {
        context.log(`Error processing city request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
        return;
    }
}
module.exports = { citiesById };
