import { getContainer } from './cosmos';
import type { RegionKey } from './cityPresets';

export type DefaultTripStop = {
  city: string;
  country: string;
  weeks: number;
};

export type DefaultTrip = {
  id: string;
  name: string;
  region: RegionKey;
  enabled: boolean;
  order: number;
  stops: DefaultTripStop[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_TRIPS_CONTAINER_ID = 'defaultTrips';

function assertCosmosConfigured() {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  if (!endpoint || !key) {
    throw new Error('CosmosDB not configured');
  }
}

export async function getDefaultTrips(filters?: {
  region?: RegionKey;
  enabled?: boolean;
}): Promise<DefaultTrip[]> {
  // Unlike cities, default trips are hub/admin only; return [] if no Cosmos.
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  if (!endpoint || !key) return [];

  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);

  let query = 'SELECT * FROM c WHERE 1=1';
  const parameters: any[] = [];

  if (filters?.region) {
    query += ' AND c.region = @region';
    parameters.push({ name: '@region', value: filters.region });
  }

  if (typeof filters?.enabled === 'boolean') {
    query += ' AND c.enabled = @enabled';
    parameters.push({ name: '@enabled', value: filters.enabled });
  }

  query += ' ORDER BY c.order ASC, c.updatedAt DESC';

  const { resources } = await container.items
    .query({ query, parameters })
    .fetchAll();

  return resources as DefaultTrip[];
}

export async function getDefaultTripById(id: string): Promise<DefaultTrip | null> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  if (!endpoint || !key) return null;

  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: id }],
    })
    .fetchAll();

  return (resources?.[0] as DefaultTrip) || null;
}

export async function createDefaultTrip(
  data: Omit<DefaultTrip, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DefaultTrip> {
  assertCosmosConfigured();
  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
  const { nanoid } = await import('nanoid');

  const now = new Date().toISOString();
  const item: DefaultTrip = {
    ...data,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };

  const { resource } = await container.items.create(item);
  return resource as DefaultTrip;
}

export async function updateDefaultTrip(
  id: string,
  updates: Partial<Omit<DefaultTrip, 'id' | 'createdAt' | 'updatedAt' | 'region'>>
): Promise<DefaultTrip> {
  assertCosmosConfigured();

  const existing = await getDefaultTripById(id);
  if (!existing) throw new Error(`Default trip ${id} not found`);

  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);

  // Defensive: ignore any attempts to overwrite immutable fields.
  const { id: _id, region: _region, createdAt: _createdAt, updatedAt: _updatedAt, ...safeUpdates } =
    (updates || {}) as any;

  const updated: DefaultTrip = {
    ...existing,
    ...safeUpdates,
    updatedAt: new Date().toISOString(),
  };

  // Partition key is expected to be /region (see src/lib/cosmos.ts)
  const { resource } = await container.item(id, existing.region).replace(updated);
  return resource as DefaultTrip;
}

export async function deleteDefaultTrip(id: string): Promise<void> {
  assertCosmosConfigured();

  const existing = await getDefaultTripById(id);
  if (!existing) return;

  const container = await getContainer(DEFAULT_TRIPS_CONTAINER_ID);
  await container.item(id, existing.region).delete();
}

