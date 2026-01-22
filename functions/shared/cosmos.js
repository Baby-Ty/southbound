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
exports.getContainer = getContainer;
exports.saveRoute = saveRoute;
exports.getRoute = getRoute;
exports.updateRoute = updateRoute;
exports.getAllRoutes = getAllRoutes;
exports.deleteRoute = deleteRoute;
exports.saveLead = saveLead;
exports.getLead = getLead;
exports.updateLead = updateLead;
exports.getAllLeads = getAllLeads;
exports.deleteLead = deleteLead;
exports.createDefaultTrip = createDefaultTrip;
exports.getDefaultTrips = getDefaultTrips;
exports.getDefaultTripById = getDefaultTripById;
exports.updateDefaultTrip = updateDefaultTrip;
exports.deleteDefaultTrip = deleteDefaultTrip;
exports.createTripTemplate = createTripTemplate;
exports.getTripTemplates = getTripTemplates;
exports.getTripTemplateById = getTripTemplateById;
exports.updateTripTemplate = updateTripTemplate;
exports.deleteTripTemplate = deleteTripTemplate;
exports.createRouteCard = createRouteCard;
exports.getRouteCards = getRouteCards;
exports.getRouteCard = getRouteCard;
exports.updateRouteCard = updateRouteCard;
exports.deleteRouteCard = deleteRouteCard;
const cosmos_1 = require("@azure/cosmos");
function getEnvVar(name, defaultValue = '') {
    if (typeof process !== 'undefined' && process.env) {
        return process.env[name] || defaultValue;
    }
    return defaultValue;
}
let client = null;
let database = null;
function getClient() {
    if (!client) {
        // Evaluate environment variables at runtime, not at module load time
        const endpoint = getEnvVar('COSMOSDB_ENDPOINT', '');
        const key = getEnvVar('COSMOSDB_KEY', '');
        if (!endpoint || !key) {
            const error = new Error('CosmosDB credentials not configured. Set COSMOSDB_ENDPOINT and COSMOSDB_KEY environment variables.');
            console.error('CosmosDB Error:', error.message);
            throw error;
        }
        try {
            client = new cosmos_1.CosmosClient({ endpoint, key });
        }
        catch (err) {
            console.error('Failed to initialize CosmosDB client:', err);
            throw new Error('Failed to connect to CosmosDB. Please check your credentials.');
        }
    }
    return client;
}
async function getDatabase() {
    if (!database) {
        try {
            const cosmosClient = getClient();
            const databaseId = getEnvVar('COSMOSDB_DATABASE_ID', 'southbound');
            const { database: db } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
            database = db;
        }
        catch (error) {
            console.error('Error getting database:', error);
            throw error;
        }
    }
    return database;
}
async function getContainer(containerId) {
    try {
        const db = await getDatabase();
        const partitionKeys = {
            'cities': { paths: ['/region'] },
            'countries': { paths: ['/region'] },
            'defaultTrips': { paths: ['/region'] },
            'tripTemplates': { paths: ['/region'] },
            'routeCards': { paths: ['/region'] },
            'savedRoutes': { paths: ['/id'] },
            'activities': { paths: ['/id'] },
            'accommodationTypes': { paths: ['/id'] },
            'leads': { paths: ['/id'] },
        };
        const partitionKey = partitionKeys[containerId] || { paths: ['/id'] };
        const { container } = await db.containers.createIfNotExists({
            id: containerId,
            partitionKey,
        });
        return container;
    }
    catch (error) {
        console.error(`Error getting container ${containerId}:`, error);
        throw error;
    }
}
const ROUTES_CONTAINER_ID = 'savedRoutes';
async function saveRoute(routeData) {
    const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
    const container = await getContainer(ROUTES_CONTAINER_ID);
    const route = {
        ...routeData,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.items.create(route);
    return resource;
}
async function getRoute(routeId) {
    try {
        const container = await getContainer(ROUTES_CONTAINER_ID);
        const { resource } = await container.item(routeId, routeId).read();
        return resource;
    }
    catch (error) {
        if (error.code === 404) {
            return null;
        }
        throw error;
    }
}
async function updateRoute(routeId, updates) {
    const container = await getContainer(ROUTES_CONTAINER_ID);
    const existing = await getRoute(routeId);
    if (!existing) {
        throw new Error(`Route ${routeId} not found`);
    }
    const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.item(routeId, routeId).replace(updated);
    return resource;
}
async function getAllRoutes(filters) {
    const container = await getContainer(ROUTES_CONTAINER_ID);
    let query = 'SELECT * FROM c WHERE 1=1';
    const params = [];
    if (filters?.status) {
        query += ' AND c.status = @status';
        params.push({ name: '@status', value: filters.status });
    }
    if (filters?.email) {
        query += ' AND c.email = @email';
        params.push({ name: '@email', value: filters.email });
    }
    if (filters?.region) {
        query += ' AND c.region = @region';
        params.push({ name: '@region', value: filters.region });
    }
    query += ' ORDER BY c.createdAt DESC';
    const { resources } = await container.items.query({
        query,
        parameters: params,
    }).fetchAll();
    return resources;
}
async function deleteRoute(routeId) {
    const container = await getContainer(ROUTES_CONTAINER_ID);
    await container.item(routeId, routeId).delete();
}
const LEADS_CONTAINER_ID = 'leads';
async function saveLead(leadData) {
    const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
    const container = await getContainer(LEADS_CONTAINER_ID);
    const lead = {
        ...leadData,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.items.create(lead);
    return resource;
}
async function getLead(leadId) {
    try {
        const container = await getContainer(LEADS_CONTAINER_ID);
        const { resource } = await container.item(leadId, leadId).read();
        return resource;
    }
    catch (error) {
        if (error.code === 404) {
            return null;
        }
        throw error;
    }
}
async function updateLead(leadId, updates) {
    const container = await getContainer(LEADS_CONTAINER_ID);
    const existing = await getLead(leadId);
    if (!existing) {
        throw new Error(`Lead ${leadId} not found`);
    }
    const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.item(leadId, leadId).replace(updated);
    return resource;
}
async function getAllLeads(filters) {
    const container = await getContainer(LEADS_CONTAINER_ID);
    let query = 'SELECT * FROM c WHERE 1=1';
    const params = [];
    if (filters?.stage) {
        query += ' AND c.stage = @stage';
        params.push({ name: '@stage', value: filters.stage });
    }
    if (filters?.destination) {
        query += ' AND c.destination = @destination';
        params.push({ name: '@destination', value: filters.destination });
    }
    // Order by createdAt only (single field doesn't require composite index)
    query += ' ORDER BY c.createdAt DESC';
    const { resources } = await container.items.query({
        query,
        parameters: params,
    }).fetchAll();
    return resources;
}
async function deleteLead(leadId) {
    const container = await getContainer(LEADS_CONTAINER_ID);
    await container.item(leadId, leadId).delete();
}
const DEFAULT_TRIPS_CONTAINER_ID = 'defaultTrips';
async function createDefaultTrip(data) {
    const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
    const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
    const now = new Date().toISOString();
    const trip = {
        ...data,
        id: nanoid(),
        createdAt: now,
        updatedAt: now,
    };
    const { resource } = await container.items.create(trip);
    return resource;
}
async function getDefaultTrips(filters) {
    const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
    let query = 'SELECT * FROM c WHERE 1=1';
    const params = [];
    if (filters?.region) {
        query += ' AND c.region = @region';
        params.push({ name: '@region', value: filters.region });
    }
    if (typeof filters?.enabled === 'boolean') {
        query += ' AND c.enabled = @enabled';
        params.push({ name: '@enabled', value: filters.enabled });
    }
    query += ' ORDER BY c.order ASC, c.updatedAt DESC';
    const { resources } = await container.items
        .query({ query, parameters: params })
        .fetchAll();
    return resources;
}
async function getDefaultTripById(id) {
    const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
    const { resources } = await container.items
        .query({
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: id }],
    })
        .fetchAll();
    return resources?.[0] || null;
}
async function updateDefaultTrip(id, updates) {
    const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
    const existing = await getDefaultTripById(id);
    if (!existing)
        throw new Error(`Default trip ${id} not found`);
    const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.item(id, existing.region).replace(updated);
    return resource;
}
async function deleteDefaultTrip(id) {
    const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
    const existing = await getDefaultTripById(id);
    if (!existing)
        return;
    await container.item(id, existing.region).delete();
}
const TRIP_TEMPLATES_CONTAINER_ID = 'tripTemplates';
async function createTripTemplate(data) {
    const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
    const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
    const now = new Date().toISOString();
    const template = {
        ...data,
        id: nanoid(),
        createdAt: now,
        updatedAt: now,
    };
    const { resource } = await container.items.create(template);
    return resource;
}
async function getTripTemplates(filters) {
    const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
    let query = 'SELECT * FROM c WHERE 1=1';
    const params = [];
    if (filters?.region) {
        query += ' AND c.region = @region';
        params.push({ name: '@region', value: filters.region });
    }
    if (typeof filters?.enabled === 'boolean') {
        query += ' AND c.enabled = @enabled';
        params.push({ name: '@enabled', value: filters.enabled });
    }
    if (typeof filters?.isCurated === 'boolean') {
        query += ' AND c.isCurated = @isCurated';
        params.push({ name: '@isCurated', value: filters.isCurated });
    }
    const { resources } = await container.items
        .query({ query, parameters: params })
        .fetchAll();
    // Sort in memory since Cosmos DB requires composite index for ORDER BY
    const sorted = resources.sort((a, b) => {
        // If filtering by curated, sort by curatedOrder first
        if (filters?.isCurated && a.isCurated && b.isCurated) {
            const orderA = a.curatedOrder ?? 999;
            const orderB = b.curatedOrder ?? 999;
            if (orderA !== orderB)
                return orderA - orderB;
        }
        // Otherwise sort by normal order
        if (a.order !== b.order)
            return a.order - b.order;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return sorted;
}
async function getTripTemplateById(id, region) {
    const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
    try {
        const { resource } = await container.item(id, region).read();
        return resource;
    }
    catch (error) {
        if (error.code === 404) {
            return null;
        }
        throw error;
    }
}
async function updateTripTemplate(id, region, updates) {
    const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
    const existing = await getTripTemplateById(id, region);
    if (!existing)
        throw new Error(`Trip template ${id} not found`);
    console.log(`[Cosmos] Updating template ${id} in region ${region}`);
    console.log(`[Cosmos] Updates received:`, JSON.stringify(updates, null, 2));
    console.log(`[Cosmos] Existing isCurated:`, existing.isCurated);
    console.log(`[Cosmos] Updates isCurated:`, updates.isCurated);
    const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    console.log(`[Cosmos] Final updated object isCurated:`, updated.isCurated);
    console.log(`[Cosmos] Final updated object curatedOrder:`, updated.curatedOrder);
    console.log(`[Cosmos] Sending to CosmosDB:`, JSON.stringify({
        id: updated.id,
        isCurated: updated.isCurated,
        curatedOrder: updated.curatedOrder,
        name: updated.name,
    }, null, 2));
    const { resource } = await container.item(id, region).replace(updated);
    console.log(`[Cosmos] Replace response isCurated:`, resource?.isCurated);
    console.log(`[Cosmos] Replace response curatedOrder:`, resource?.curatedOrder);
    // CosmosDB replace might not return all fields, so fetch it back to ensure we have the complete document
    const { resource: verified } = await container.item(id, region).read();
    console.log(`[Cosmos] Verified read isCurated:`, verified?.isCurated);
    console.log(`[Cosmos] Verified read curatedOrder:`, verified?.curatedOrder);
    return verified;
}
async function deleteTripTemplate(id, region) {
    const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
    await container.item(id, region).delete();
}
const ROUTE_CARDS_CONTAINER_ID = 'routeCards';
async function createRouteCard(data) {
    const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
    const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
    const now = new Date().toISOString();
    const routeCard = {
        ...data,
        id: nanoid(),
        createdAt: now,
        updatedAt: now,
    };
    const { resource } = await container.items.create(routeCard);
    return resource;
}
async function getRouteCards(filters) {
    const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
    let query = 'SELECT * FROM c WHERE 1=1';
    const params = [];
    if (filters?.region) {
        query += ' AND c.region = @region';
        params.push({ name: '@region', value: filters.region });
    }
    if (typeof filters?.enabled === 'boolean') {
        query += ' AND c.enabled = @enabled';
        params.push({ name: '@enabled', value: filters.enabled });
    }
    const { resources } = await container.items
        .query({ query, parameters: params })
        .fetchAll();
    // Sort in memory since Cosmos DB requires composite index for ORDER BY
    const sorted = resources.sort((a, b) => {
        if (a.order !== b.order)
            return a.order - b.order;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return sorted;
}
async function getRouteCard(id, region) {
    const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
    try {
        const { resource } = await container.item(id, region).read();
        return resource;
    }
    catch (error) {
        if (error.code === 404) {
            return null;
        }
        throw error;
    }
}
async function updateRouteCard(id, region, updates) {
    const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
    const existing = await getRouteCard(id, region);
    if (!existing)
        throw new Error(`Route card ${id} not found`);
    const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    const { resource } = await container.item(id, region).replace(updated);
    return resource;
}
async function deleteRouteCard(id, region) {
    const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
    await container.item(id, region).delete();
}
