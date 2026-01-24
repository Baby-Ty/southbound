"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countriesById = countriesById;
const cosmos_countries_1 = require("../shared/cosmos-countries");
const cors_1 = require("../shared/cors");
async function countriesById(context, req) {
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
        context.res = (0, cors_1.createCorsResponse)({ error: 'Country ID is required' }, 400);
        return;
    }
    try {
        if (req.method === 'GET') {
            const country = await (0, cosmos_countries_1.getCountry)(id);
            if (!country) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Country not found' }, 404);
                return;
            }
            context.res = (0, cors_1.createCorsResponse)({ country });
            return;
        }
        else if (req.method === 'PATCH') {
            const body = req.body;
            const country = await (0, cosmos_countries_1.updateCountry)(id, body);
            context.log(`[countries-by-id] Updated country: ${country.name}`);
            context.res = (0, cors_1.createCorsResponse)({ country });
            return;
        }
        else if (req.method === 'DELETE') {
            await (0, cosmos_countries_1.deleteCountry)(id);
            context.log(`[countries-by-id] Deleted country: ${id}`);
            context.res = (0, cors_1.createCorsResponse)({ success: true });
            return;
        }
        else {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
            return;
        }
    }
    catch (error) {
        context.log(`[countries-by-id] Error processing country request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
        return;
    }
}
module.exports = { countriesById };
