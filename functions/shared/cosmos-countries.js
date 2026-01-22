"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCountries = getAllCountries;
exports.getCountry = getCountry;
exports.getCountryByName = getCountryByName;
exports.saveCountry = saveCountry;
exports.updateCountry = updateCountry;
exports.deleteCountry = deleteCountry;
const cosmos_1 = require("./cosmos");
const COUNTRIES_CONTAINER_ID = 'countries';
async function getAllCountries(region) {
    const endpoint = process.env.COSMOSDB_ENDPOINT || '';
    const key = process.env.COSMOSDB_KEY || '';
    if (!endpoint || !key) {
        console.warn('[getAllCountries] CosmosDB not configured, returning empty array');
        return [];
    }
    try {
        const container = await (0, cosmos_1.getContainer)(COUNTRIES_CONTAINER_ID);
        let query = 'SELECT * FROM c WHERE c.enabled = true';
        const params = [];
        if (region) {
            query += ' AND c.region = @region';
            params.push({ name: '@region', value: region });
        }
        query += ' ORDER BY c.name ASC';
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
        console.error('[getAllCountries] Error:', error);
        return [];
    }
}
async function getCountry(countryId) {
    try {
        const container = await (0, cosmos_1.getContainer)(COUNTRIES_CONTAINER_ID);
        const { resources } = await container.items.query({
            query: 'SELECT * FROM c WHERE c.id = @countryId',
            parameters: [{ name: '@countryId', value: countryId }],
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
async function getCountryByName(name, region) {
    try {
        const container = await (0, cosmos_1.getContainer)(COUNTRIES_CONTAINER_ID);
        const { resources } = await container.items.query({
            query: 'SELECT * FROM c WHERE c.name = @name AND c.region = @region',
            parameters: [
                { name: '@name', value: name },
                { name: '@region', value: region },
            ],
        }).fetchAll();
        return resources[0];
    }
    catch (error) {
        console.error('Error fetching country by name:', error);
        return null;
    }
}
async function saveCountry(countryData) {
    const endpoint = process.env.COSMOSDB_ENDPOINT || '';
    const key = process.env.COSMOSDB_KEY || '';
    if (!endpoint || !key) {
        throw new Error('CosmosDB not configured');
    }
    const container = await (0, cosmos_1.getContainer)(COUNTRIES_CONTAINER_ID);
    const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
    const country = {
        ...countryData,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.items.create(country);
    return resource;
}
async function updateCountry(countryId, updates) {
    const container = await (0, cosmos_1.getContainer)(COUNTRIES_CONTAINER_ID);
    const existing = await getCountry(countryId);
    if (!existing) {
        throw new Error(`Country ${countryId} not found`);
    }
    const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.item(countryId, existing.region).replace(updated);
    return resource;
}
async function deleteCountry(countryId) {
    const container = await (0, cosmos_1.getContainer)(COUNTRIES_CONTAINER_ID);
    const existing = await getCountry(countryId);
    if (!existing) {
        throw new Error(`Country ${countryId} not found`);
    }
    await container.item(countryId, existing.region).delete();
}
