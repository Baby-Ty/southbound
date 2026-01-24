"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leads = leads;
const cosmos_1 = require("../shared/cosmos");
const cors_1 = require("../shared/cors");
function isCosmosDBConfigured() {
    return !!(process.env.COSMOSDB_ENDPOINT &&
        process.env.COSMOSDB_KEY &&
        process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
        process.env.COSMOSDB_KEY.trim() !== '');
}
async function leads(context, req) {
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
            const { name, destination, stage, notes, lastContact } = body;
            if (!name || !destination) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name and destination are required' }, 400);
                return;
            }
            if (!name.trim()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Name is required' }, 400);
                return;
            }
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
                return;
            }
            const lead = await (0, cosmos_1.saveLead)({
                name: name.trim(),
                destination: destination.trim(),
                stage: stage || 'New',
                notes: notes || '',
                lastContact: lastContact || new Date().toISOString(),
            });
            context.res = (0, cors_1.createCorsResponse)({ lead }, 201);
            return;
        }
        else if (req.method === 'GET') {
            const stage = req.query.stage;
            const destination = req.query.destination;
            const filters = {};
            if (stage)
                filters.stage = stage;
            if (destination)
                filters.destination = destination;
            if (!isCosmosDBConfigured()) {
                context.res = (0, cors_1.createCorsResponse)({ leads: [] });
                return;
            }
            const leads = await (0, cosmos_1.getAllLeads)(filters);
            context.res = (0, cors_1.createCorsResponse)({ leads });
            return;
        }
        else {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
            return;
        }
    }
    catch (error) {
        context.log(`Error processing leads request: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500);
        return;
    }
}
module.exports = { leads };
