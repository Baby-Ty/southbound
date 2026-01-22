"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCities = getAllCities;
exports.getCity = getCity;
exports.updateCity = updateCity;
exports.deleteCity = deleteCity;
const cosmos_1 = require("./cosmos");
const CITIES_CONTAINER_ID = 'cities';
async function getAllCities(region) {
    const endpoint = process.env.COSMOSDB_ENDPOINT || '';
    const key = process.env.COSMOSDB_KEY || '';
    if (!endpoint || !key) {
        console.warn('[getAllCities] CosmosDB not configured, returning empty array');
        return [];
    }
    try {
        const container = await (0, cosmos_1.getContainer)(CITIES_CONTAINER_ID);
        let query = 'SELECT * FROM c WHERE c.enabled = true';
        const params = [];
        if (region) {
            query += ' AND c.region = @region';
            params.push({ name: '@region', value: region });
        }
        query += ' ORDER BY c.city ASC';
        const queryOptions = {
            query,
        };
        if (params.length > 0) {
            queryOptions.parameters = params;
        }
        const { resources } = await container.items.query(queryOptions).fetchAll();
        return resources;
    }
    catch (error) {
        console.error('[getAllCities] Error:', error);
        return [];
    }
}
async function getCity(cityId) {
    try {
        const container = await (0, cosmos_1.getContainer)(CITIES_CONTAINER_ID);
        // Use cross-partition query since we don't know the region (partition key)
        const { resources } = await container.items.query({
            query: 'SELECT * FROM c WHERE c.id = @cityId',
            parameters: [{ name: '@cityId', value: cityId }],
        }).fetchAll();
        return resources[0];
    }
    catch (error) {
        if (error.code === 404) {
            return null;
        }
        throw error;
    }
}
async function updateCity(cityId, updates) {
    const container = await (0, cosmos_1.getContainer)(CITIES_CONTAINER_ID);
    const existing = await getCity(cityId);
    if (!existing) {
        throw new Error(`City ${cityId} not found`);
    }
    const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    // Use region as partition key
    const { resource } = await container.item(cityId, existing.region).replace(updated);
    return resource;
}
async function deleteCity(cityId) {
    const container = await (0, cosmos_1.getContainer)(CITIES_CONTAINER_ID);
    // First get the city to find its region (partition key)
    const existing = await getCity(cityId);
    if (!existing) {
        throw new Error(`City ${cityId} not found`);
    }
    // Use region as partition key
    await container.item(cityId, existing.region).delete();
}
