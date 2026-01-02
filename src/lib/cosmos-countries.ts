import { getContainer } from './cosmos';
import { RegionKey } from './cityPresets';

// Country data stored in CosmosDB
export interface CountryData {
  id: string;
  name: string;
  flag: string;
  region: RegionKey;
  description?: string; // Rich description of the country
  enabled: boolean;
  // For future enhancements
  visaInfo?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

const COUNTRIES_CONTAINER_ID = 'countries';

// Country CRUD Operations
export async function getAllCountries(region?: RegionKey): Promise<CountryData[]> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    console.warn('[getAllCountries] CosmosDB not configured, returning empty array');
    // Return empty array gracefully - this is expected if CosmosDB isn't set up yet
    return [];
  }

  try {
    console.log('[getAllCountries] Getting container:', COUNTRIES_CONTAINER_ID);
    const container = await getContainer(COUNTRIES_CONTAINER_ID);
    
    // Query all enabled countries (cross-partition query)
    let query = 'SELECT * FROM c WHERE c.enabled = true';
    const params: any[] = [];
    
    if (region) {
      query += ' AND c.region = @region';
      params.push({ name: '@region', value: region });
    }
    
    query += ' ORDER BY c.name ASC';

    const querySpec = {
      query,
      parameters: params,
    };

    console.log('[getAllCountries] Executing query:', query);
    const { resources } = await container.items.query(querySpec).fetchAll();
    console.log('[getAllCountries] Query successful, found', resources.length, 'countries');
    
    return resources as CountryData[];
  } catch (error: any) {
    console.error('[getAllCountries] Error fetching countries from CosmosDB:', error);
    console.error('[getAllCountries] Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });
    
    // If it's a connection/credential error, throw it so API route can handle it
    if (error.message?.includes('CosmosDB credentials') || error.message?.includes('connect')) {
      throw error;
    }
    
    // For other errors, return empty array (container might not exist yet)
    console.warn('[getAllCountries] Returning empty array due to error');
    return [];
  }
}

export async function getCountry(countryId: string): Promise<CountryData | null> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    return null;
  }

  try {
    const container = await getContainer(COUNTRIES_CONTAINER_ID);
    // Use query instead of direct read since partition key is /region, not /id
    const { resources } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.id = @countryId',
      parameters: [
        { name: '@countryId', value: countryId }
      ],
    }).fetchAll();
    
    return resources[0] as CountryData | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    console.error('Error fetching country:', error);
    return null;
  }
}

export async function getCountryByName(name: string, region: RegionKey): Promise<CountryData | null> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    return null;
  }

  try {
    const container = await getContainer(COUNTRIES_CONTAINER_ID);
    const { resources } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.name = @name AND c.region = @region',
      parameters: [
        { name: '@name', value: name },
        { name: '@region', value: region },
      ],
      // No need for cross-partition since we're filtering by region (partition key)
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
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    throw new Error('CosmosDB not configured');
  }

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

  // Use region as partition key (not countryId)
  const { resource } = await container.item(countryId, existing.region).replace(updated);
  return resource as CountryData;
}

export async function deleteCountry(countryId: string): Promise<void> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    throw new Error('CosmosDB not configured');
  }

  const container = await getContainer(COUNTRIES_CONTAINER_ID);
  
  // First get the country to find its region (partition key)
  const existing = await getCountry(countryId);
  if (!existing) {
    throw new Error(`Country ${countryId} not found`);
  }
  
  // Use region as partition key (not countryId)
  await container.item(countryId, existing.region).delete();
}
