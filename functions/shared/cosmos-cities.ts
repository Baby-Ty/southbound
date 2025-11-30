import { getContainer } from './cosmos';

export interface CityData {
  id: string;
  city: string;
  country: string;
  flag: string;
  region: string;
  enabled: boolean;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  imageUrls: string[];
  imageUrl?: string;
  highlightImages?: string[];
  activityImages?: string[];
  accommodationImages?: string[];
  highlights: {
    places: string[];
    accommodation: string;
    activities: string[];
    notesHint: string;
  };
  weather: {
    avgTemp: string;
    bestMonths: string;
    climate: 'tropical' | 'mediterranean' | 'temperate' | 'dry';
  };
  costs: {
    accommodation: string;
    coworking: string;
    meals: string;
    monthlyTotal: string;
  };
  nomadScore: number;
  internetSpeed: string;
  availableActivities: string[];
  availableAccommodation: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const CITIES_CONTAINER_ID = 'cities';

export async function getAllCities(region?: string): Promise<CityData[]> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    console.warn('[getAllCities] CosmosDB not configured, returning empty array');
    return [];
  }

  try {
    const container = await getContainer(CITIES_CONTAINER_ID);
    
    let query = 'SELECT * FROM c WHERE c.enabled = true';
    const params: any[] = [];
    
    if (region) {
      query += ' AND c.region = @region';
      params.push({ name: '@region', value: region });
    }
    
    query += ' ORDER BY c.city ASC';

    const queryOptions: any = {
      query,
    };
    
    if (params.length > 0) {
      queryOptions.parameters = params;
    }

    const { resources } = await container.items.query(queryOptions).fetchAll();
    return resources as CityData[];
  } catch (error: any) {
    console.error('[getAllCities] Error:', error);
    return [];
  }
}

export async function getCity(cityId: string): Promise<CityData | null> {
  try {
    const container = await getContainer(CITIES_CONTAINER_ID);
    const { resource } = await container.item(cityId, cityId).read();
    return resource as CityData | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateCity(cityId: string, updates: Partial<CityData>): Promise<CityData> {
  const container = await getContainer(CITIES_CONTAINER_ID);
  
  const existing = await getCity(cityId);
  if (!existing) {
    throw new Error(`City ${cityId} not found`);
  }

  const updated: CityData = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(cityId, cityId).replace(updated);
  return resource as CityData;
}

export async function deleteCity(cityId: string): Promise<void> {
  const container = await getContainer(CITIES_CONTAINER_ID);
  await container.item(cityId, cityId).delete();
}

