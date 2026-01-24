"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsById = leadsById;
const cosmos_1 = require("../shared/cosmos");
const cors_1 = require("../shared/cors");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function leadsById(context, req) {
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
        context.res = (0, cors_1.createCorsResponse)({ error: 'Lead ID is required' }, 400);
        return;
    }
    try {
        if (req.method === 'GET') {
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const lead = await (0, cosmos_1.getLead)(id);
            if (!lead) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Lead not found' }, 404);
                return;
            }
            context.res = (0, cors_1.createCorsResponse)({ lead });
            return;
        }
        else if (req.method === 'PATCH') {
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const body = req.body;
            const lead = await (0, cosmos_1.updateLead)(id, body);
            context.res = (0, cors_1.createCorsResponse)({ lead });
            return;
        }
        else if (req.method === 'DELETE') {
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            await (0, cosmos_1.deleteLead)(id);
            context.res = (0, cors_1.createCorsResponse)({ success: true });
            return;
        }
        else {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
            return;
        }
    }
    catch (error) {
        context.log(`Error processing lead request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
        return;
    }
}
module.exports = { leadsById };
