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
async function leads(request, context) {
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
            const { name, destination, stage, notes, lastContact } = body;
            if (!name || !destination) {
                return (0, cors_1.createCorsResponse)({ error: 'Missing required fields: name and destination are required' }, 400);
            }
            if (!name.trim()) {
                return (0, cors_1.createCorsResponse)({ error: 'Name is required' }, 400);
            }
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ error: 'CosmosDB is not configured' }, 500);
            }
            const lead = await (0, cosmos_1.saveLead)({
                name: name.trim(),
                destination: destination.trim(),
                stage: stage || 'New',
                notes: notes || '',
                lastContact: lastContact || new Date().toISOString(),
            });
            return (0, cors_1.createCorsResponse)({ lead }, 201);
        }
        else if (request.method === 'GET') {
            const stage = request.query.get('stage');
            const destination = request.query.get('destination');
            const filters = {
                ...(stage && { stage }),
                ...(destination && { destination }),
            };
            if (!isCosmosDBConfigured()) {
                return (0, cors_1.createCorsResponse)({ leads: [] });
            }
            const leads = await (0, cosmos_1.getAllLeads)(filters);
            return (0, cors_1.createCorsResponse)({ leads });
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Method not allowed' }, 405);
        }
    }
    catch (error) {
        context.log(`Error processing leads request: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to process request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500);
    }
}
module.exports = { leads };
