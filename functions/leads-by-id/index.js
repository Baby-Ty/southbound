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
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    const id = req.params.id;
    if (!id) {
        return (0, cors_1.createCorsResponse)({ error: 'Lead ID is required' }, 400);
    }
    try {
        if (req.method === 'GET') {
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            const lead = await (0, cosmos_1.getLead)(id);
            if (!lead) {
                return (0, cors_1.createCorsResponse)({ error: 'Lead not found' }, 404);
            }
            return (0, cors_1.createCorsResponse)({ lead });
        }
        else if (req.method === 'PATCH') {
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            const body = req.body;
            const lead = await (0, cosmos_1.updateLead)(id, body);
            return (0, cors_1.createCorsResponse)({ lead });
        }
        else if (req.method === 'DELETE') {
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            await (0, cosmos_1.deleteLead)(id);
            return (0, cors_1.createCorsResponse)({ success: true });
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        }
    }
    catch (error) {
        context.log(`Error processing lead request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({ error: error.message || 'Failed to process request' }, 500);
    }
}
module.exports = { leadsById };
