import { getContainer } from './cosmos';

export interface CountryData {
  id: string;
  name: string;
  flag: string;
  region: string;
  description?: string;
  enabled: boolean;
  visaInfo?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

const COUNTRIES_CONTAINER_ID = 'countries';

export async function getAllCountries(region?: string): Promise<CountryData[]> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    console.warn('[getAllCountries] CosmosDB not configured, returning empty array');
    return [];
  }

  try {
    const container = await getContainer(COUNTRIES_CONTAINER_ID);
    
    let query = 'SELECT * FROM c WHERE c.enabled = true';
    const params: any[] = [];
    
    if (region) {
      query += ' AND c.region = @region';
      params.push({ name: '@region', value: region });
    }
    
    query += ' ORDER BY c.name ASC';

    const queryOptions: any = {
      query,
    };
    
    if (params.length > 0) {
      queryOptions.parameters = params;
    }

    const { resources } = await container.items.query(queryOptions).fetchAll();
    return resources as CountryData[];
  } catch (error: any) {
    console.error('[getAllCountries] Error:', error);
    return [];
  }
}

export async function getCountry(countryId: string): Promise<CountryData | null> {
  try {
    const container = await getContainer(COUNTRIES_CONTAINER_ID);
    const { resources } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.id = @countryId',
      parameters: [{ name: '@countryId', value: countryId }],
    }).fetchAll();
    
    return resources[0] as CountryData | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function getCountryByName(name: string, region: string): Promise<CountryData | null> {
  try {
    const container = await getContainer(COUNTRIES_CONTAINER_ID);
    const { resources } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.name = @name AND c.region = @region',
      parameters: [
        { name: '@name', value: name },
        { name: '@region', value: region },
      ],
    }).fetchAll();

    return resources[0] as CountryData | null;
  } catch (error: any) {
    console.error('Error fetching country by name:', error);
    return null;
  }
}

export async function saveCountry(countryData: Omit<CountryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CountryData> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    throw new Error('CosmosDB not configured');
  }

  const container = await getContainer(COUNTRIES_CONTAINER_ID);
  const { nanoid } = await import('nanoid');
  
  const country: CountryData = {
    ...countryData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(country);
  return resource as CountryData;
}

export async function updateCountry(countryId: string, updates: Partial<CountryData>): Promise<CountryData> {
  const container = await getContainer(COUNTRIES_CONTAINER_ID);
  
  const existing = await getCountry(countryId);
  if (!existing) {
    throw new Error(`Country ${countryId} not found`);
  }

  const updated: CountryData = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(countryId, existing.region).replace(updated);
  return resource as CountryData;
}

export async function deleteCountry(countryId: string): Promise<void> {
  const container = await getContainer(COUNTRIES_CONTAINER_ID);
  
  const existing = await getCountry(countryId);
  if (!existing) {
    throw new Error(`Country ${countryId} not found`);
  }
  
  await container.item(countryId, existing.region).delete();
}
