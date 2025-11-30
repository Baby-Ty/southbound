import { CosmosClient, Database, Container } from '@azure/cosmos';

function getEnvVar(name: string, defaultValue: string = ''): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue;
  }
  return defaultValue;
}

const endpoint = getEnvVar('COSMOSDB_ENDPOINT', '');
const key = getEnvVar('COSMOSDB_KEY', '');
const databaseId = getEnvVar('COSMOSDB_DATABASE_ID', 'southbound');

let client: CosmosClient | null = null;
let database: Database | null = null;

function getClient(): CosmosClient {
  if (!client) {
    if (!endpoint || !key) {
      const error = new Error('CosmosDB credentials not configured. Set COSMOSDB_ENDPOINT and COSMOSDB_KEY environment variables.');
      console.error('CosmosDB Error:', error.message);
      throw error;
    }
    try {
      client = new CosmosClient({ endpoint, key });
    } catch (err: any) {
      console.error('Failed to initialize CosmosDB client:', err);
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
    
    const partitionKeys: Record<string, { paths: string[] }> = {
      'cities': { paths: ['/region'] },
      'savedRoutes': { paths: ['/id'] },
      'activities': { paths: ['/id'] },
      'accommodationTypes': { paths: ['/id'] },
    };
    
    const partitionKey = partitionKeys[containerId] || { paths: ['/id'] };
    
    const { container } = await db.containers.createIfNotExists({ 
      id: containerId,
      partitionKey,
    });
    return container;
  } catch (error: any) {
    console.error(`Error getting container ${containerId}:`, error);
    throw error;
  }
}

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

export interface StopPlan {
  id: string;
  city: string;
  country: string;
  weeks: number;
  weeksEdited?: boolean;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  highlights: {
    places: string[];
    accommodation: string;
    activities: string[];
    notes: string;
    notesHint?: string;
  };
}

const ROUTES_CONTAINER_ID = 'savedRoutes';

export async function saveRoute(routeData: Omit<SavedRoute, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedRoute> {
  const { nanoid } = await import('nanoid');
  const container = await getContainer(ROUTES_CONTAINER_ID);
  
  const route: SavedRoute = {
    ...routeData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(route);
  return resource as SavedRoute;
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

