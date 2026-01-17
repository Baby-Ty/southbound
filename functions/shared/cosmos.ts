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

// Lead Types and CRUD Operations
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

const LEADS_CONTAINER_ID = 'leads';

export async function saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
  const { nanoid } = await import('nanoid');
  const container = await getContainer(LEADS_CONTAINER_ID);
  
  const lead: Lead = {
    ...leadData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(lead);
  return resource as Lead;
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

// Default Trips (starter trips after itinerary wizard)
export interface DefaultTripStop {
  city: string;
  country: string;
  weeks: number;
}

export interface DefaultTrip {
  id: string;
  name: string;
  region: string;
  enabled: boolean;
  order: number;
  stops: DefaultTripStop[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_TRIPS_CONTAINER_ID = 'defaultTrips';

export async function createDefaultTrip(
  data: Omit<DefaultTrip, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DefaultTrip> {
  const { nanoid } = await import('nanoid');
  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
  const now = new Date().toISOString();

  const trip: DefaultTrip = {
    ...data,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };

  const { resource } = await container.items.create(trip);
  return resource as DefaultTrip;
}

export async function getDefaultTrips(filters?: {
  region?: string;
  enabled?: boolean;
}): Promise<DefaultTrip[]> {
  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);

  let query = 'SELECT * FROM c WHERE 1=1';
  const params: any[] = [];

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

  return resources as DefaultTrip[];
}

export async function getDefaultTripById(id: string): Promise<DefaultTrip | null> {
  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: id }],
    })
    .fetchAll();

  return (resources?.[0] as DefaultTrip) || null;
}

export async function updateDefaultTrip(
  id: string,
  updates: Partial<Omit<DefaultTrip, 'id' | 'createdAt' | 'updatedAt' | 'region'>>
): Promise<DefaultTrip> {
  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
  const existing = await getDefaultTripById(id);
  if (!existing) throw new Error(`Default trip ${id} not found`);

  const updated: DefaultTrip = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(id, existing.region).replace(updated);
  return resource as DefaultTrip;
}

export async function deleteDefaultTrip(id: string): Promise<void> {
  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
  const existing = await getDefaultTripById(id);
  if (!existing) return;
  await container.item(id, existing.region).delete();
}

// Trip Templates (adventure style templates for route builder)
export interface TripTemplate {
  id: string;
  region: 'europe' | 'latin-america' | 'southeast-asia';
  name: string;
  description: string;
  icon: string;
  imageUrl: string;
  presetCities: string[]; // City names for itinerary seeding
  tags: string[];
  enabled: boolean;
  order: number; // Sort order within region
  createdAt: string;
  updatedAt: string;
}

const TRIP_TEMPLATES_CONTAINER_ID = 'tripTemplates';

export async function createTripTemplate(
  data: Omit<TripTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TripTemplate> {
  const { nanoid } = await import('nanoid');
  const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
  const now = new Date().toISOString();

  const template: TripTemplate = {
    ...data,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };

  const { resource } = await container.items.create(template);
  return resource as TripTemplate;
}

export async function getTripTemplates(filters?: {
  region?: 'europe' | 'latin-america' | 'southeast-asia';
  enabled?: boolean;
}): Promise<TripTemplate[]> {
  const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);

  let query = 'SELECT * FROM c WHERE 1=1';
  const params: any[] = [];

  if (filters?.region) {
    query += ' AND c.region = @region';
    params.push({ name: '@region', value: filters.region });
  }

  if (typeof filters?.enabled === 'boolean') {
    query += ' AND c.enabled = @enabled';
    params.push({ name: '@enabled', value: filters.enabled });
  }

  query += ' ORDER BY c.order ASC, c.createdAt ASC';

  const { resources } = await container.items
    .query({ query, parameters: params })
    .fetchAll();

  return resources as TripTemplate[];
}

export async function getTripTemplateById(id: string, region: string): Promise<TripTemplate | null> {
  const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
  try {
    const { resource } = await container.item(id, region).read();
    return resource as TripTemplate | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateTripTemplate(
  id: string,
  region: string,
  updates: Partial<Omit<TripTemplate, 'id' | 'createdAt' | 'updatedAt' | 'region'>>
): Promise<TripTemplate> {
  const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
  const existing = await getTripTemplateById(id, region);
  if (!existing) throw new Error(`Trip template ${id} not found`);

  const updated: TripTemplate = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(id, region).replace(updated);
  return resource as TripTemplate;
}

export async function deleteTripTemplate(id: string, region: string): Promise<void> {
  const container = await getContainer(TRIP_TEMPLATES_CONTAINER_ID);
  await container.item(id, region).delete();
}

// RouteCard Types and CRUD Operations
export interface RouteCard {
  id: string;
  region: 'europe' | 'latin-america' | 'southeast-asia';
  name: string;
  tagline: string;
  icon: string;
  imageUrl: string;
  budget: string;
  budgetLabel: string;
  timezone: string;
  vibe: string;
  overview: string;
  featuredCities: string[];
  enabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const ROUTE_CARDS_CONTAINER_ID = 'routeCards';

export async function createRouteCard(
  data: Omit<RouteCard, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RouteCard> {
  const { nanoid } = await import('nanoid');
  const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
  const now = new Date().toISOString();

  const routeCard: RouteCard = {
    ...data,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };

  const { resource } = await container.items.create(routeCard);
  return resource as RouteCard;
}

export async function getRouteCards(filters?: {
  region?: 'europe' | 'latin-america' | 'southeast-asia';
  enabled?: boolean;
}): Promise<RouteCard[]> {
  const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);

  let query = 'SELECT * FROM c WHERE 1=1';
  const params: any[] = [];

  if (filters?.region) {
    query += ' AND c.region = @region';
    params.push({ name: '@region', value: filters.region });
  }

  if (typeof filters?.enabled === 'boolean') {
    query += ' AND c.enabled = @enabled';
    params.push({ name: '@enabled', value: filters.enabled });
  }

  query += ' ORDER BY c.order ASC, c.createdAt ASC';

  const { resources } = await container.items
    .query({ query, parameters: params })
    .fetchAll();

  return resources as RouteCard[];
}

export async function getRouteCard(id: string, region: string): Promise<RouteCard | null> {
  const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
  try {
    const { resource } = await container.item(id, region).read();
    return resource as RouteCard | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateRouteCard(
  id: string,
  region: string,
  updates: Partial<Omit<RouteCard, 'id' | 'createdAt' | 'updatedAt' | 'region'>>
): Promise<RouteCard> {
  const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
  const existing = await getRouteCard(id, region);
  if (!existing) throw new Error(`Route card ${id} not found`);

  const updated: RouteCard = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(id, region).replace(updated);
  return resource as RouteCard;
}

export async function deleteRouteCard(id: string, region: string): Promise<void> {
  const container = await getContainer(ROUTE_CARDS_CONTAINER_ID);
  await container.item(id, region).delete();
}


