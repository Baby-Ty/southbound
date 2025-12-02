import { CosmosClient, Database, Container } from '@azure/cosmos';

// CosmosDB connection configuration
// Use function to get env vars to avoid issues with Next.js env loading
function getEnvVar(name: string, defaultValue: string = ''): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue;
  }
  return defaultValue;
}

const endpoint = getEnvVar('COSMOSDB_ENDPOINT', '');
const key = getEnvVar('COSMOSDB_KEY', '');
const databaseId = getEnvVar('COSMOSDB_DATABASE_ID', 'southbound');

// Initialize CosmosDB client
let client: CosmosClient | null = null;
let database: Database | null = null;

function getClient(): CosmosClient {
  if (!client) {
    if (!endpoint || !key) {
      const error = new Error('CosmosDB credentials not configured. Set COSMOSDB_ENDPOINT and COSMOSDB_KEY environment variables.');
      console.error('CosmosDB Error:', error.message);
      console.error('Endpoint:', endpoint ? 'SET' : 'NOT SET');
      console.error('Key:', key ? 'SET' : 'NOT SET');
      throw error;
    }
    try {
      client = new CosmosClient({ endpoint, key });
    } catch (err: any) {
      console.error('Failed to initialize CosmosDB client:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
      });
      throw new Error('Failed to connect to CosmosDB. Please check your credentials.');
    }
  }
  return client;
}

async function getDatabase(): Promise<Database> {
  if (!database) {
    try {
      const cosmosClient = getClient();
      const { database: db } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
      database = db;
    } catch (error: any) {
      console.error('Error getting database:', error);
      throw error;
    }
  }
  return database;
}

export async function getContainer(containerId: string): Promise<Container> {
  try {
    const db = await getDatabase();
    
    // Define partition keys for each container
    const partitionKeys: Record<string, { paths: string[] }> = {
      'cities': { paths: ['/region'] },
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
  } catch (error: any) {
    console.error(`Error getting container ${containerId}:`, error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });
    throw error;
  }
}

// Saved Route Types
export interface SavedRoute {
  id: string;
  name: string;
  email: string;
  region: string;
  stops: StopPlan[];
  preferences: {
    lifestyle: string[];
    workSetup: string[];
    travelStyle: string;
  };
  status: 'draft' | 'submitted' | 'in-review' | 'confirmed';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  adminNotes?: string;
}

export interface HighlightItem {
  title: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface StopPlan {
  id: string;
  city: string;
  country: string;
  weeks: number;
  weeksEdited?: boolean;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  highlights: {
    places: HighlightItem[] | string[]; // Support both formats for compatibility
    accommodation: string;
    activities: string[];
    notes: string;
    notesHint?: string;
  };
}

const ROUTES_CONTAINER_ID = 'savedRoutes';
const CITIES_CONTAINER_ID = 'cities';
const REGIONS_CONTAINER_ID = 'regions';
const ACTIVITIES_CONTAINER_ID = 'activities';
const ACCOMMODATION_TYPES_CONTAINER_ID = 'accommodationTypes';
const LEADS_CONTAINER_ID = 'leads';

// Route CRUD Operations
export async function saveRoute(routeData: Omit<SavedRoute, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedRoute> {
  try {
    const container = await getContainer(ROUTES_CONTAINER_ID);
    const { nanoid } = await import('nanoid');
    
    const route: SavedRoute = {
      ...routeData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(route);
    return resource as SavedRoute;
  } catch (error: any) {
    // If CosmosDB is not configured, throw error to be caught by API route
    if (error.message?.includes('CosmosDB credentials') || error.message?.includes('connect')) {
      throw error;
    }
    throw new Error(`Failed to save route: ${error.message || 'Unknown error'}`);
  }
}

export async function getRoute(routeId: string): Promise<SavedRoute | null> {
  try {
    const container = await getContainer(ROUTES_CONTAINER_ID);
    const { resource } = await container.item(routeId, routeId).read();
    return resource as SavedRoute | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateRoute(routeId: string, updates: Partial<SavedRoute>): Promise<SavedRoute> {
  const container = await getContainer(ROUTES_CONTAINER_ID);
  
  // Get existing route
  const existing = await getRoute(routeId);
  if (!existing) {
    throw new Error(`Route ${routeId} not found`);
  }

  const updated: SavedRoute = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(routeId, routeId).replace(updated);
  return resource as SavedRoute;
}

export async function getAllRoutes(filters?: {
  status?: SavedRoute['status'];
  email?: string;
  region?: string;
}): Promise<SavedRoute[]> {
  const container = await getContainer(ROUTES_CONTAINER_ID);
  
  let query = 'SELECT * FROM c WHERE 1=1';
  const params: any[] = [];
  
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

  return resources as SavedRoute[];
}

export async function deleteRoute(routeId: string): Promise<void> {
  const container = await getContainer(ROUTES_CONTAINER_ID);
  await container.item(routeId, routeId).delete();
}

// Lead Types
export interface Lead {
  id: string;
  name: string;
  destination: string;
  stage: 'New' | 'Warm' | 'Sent Builder' | 'Closed' | 'Lost';
  notes: string;
  lastContact: string;
  createdAt: string;
  updatedAt: string;
}

// Lead CRUD Operations
export async function saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
  try {
    const container = await getContainer(LEADS_CONTAINER_ID);
    const { nanoid } = await import('nanoid');
    
    const lead: Lead = {
      ...leadData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(lead);
    return resource as Lead;
  } catch (error: any) {
    if (error.message?.includes('CosmosDB credentials') || error.message?.includes('connect')) {
      throw error;
    }
    throw new Error(`Failed to save lead: ${error.message || 'Unknown error'}`);
  }
}

export async function getLead(leadId: string): Promise<Lead | null> {
  try {
    const container = await getContainer(LEADS_CONTAINER_ID);
    const { resource } = await container.item(leadId, leadId).read();
    return resource as Lead | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
  const container = await getContainer(LEADS_CONTAINER_ID);
  
  const existing = await getLead(leadId);
  if (!existing) {
    throw new Error(`Lead ${leadId} not found`);
  }

  const updated: Lead = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(leadId, leadId).replace(updated);
  return resource as Lead;
}

export async function getAllLeads(filters?: {
  stage?: Lead['stage'];
  destination?: string;
}): Promise<Lead[]> {
  const container = await getContainer(LEADS_CONTAINER_ID);
  
  let query = 'SELECT * FROM c WHERE 1=1';
  const params: any[] = [];
  
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

  return resources as Lead[];
}

export async function deleteLead(leadId: string): Promise<void> {
  const container = await getContainer(LEADS_CONTAINER_ID);
  await container.item(leadId, leadId).delete();
}

