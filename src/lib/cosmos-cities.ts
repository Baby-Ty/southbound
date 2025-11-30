import { getContainer } from './cosmos';
import { CityPreset, RegionKey } from './cityPresets';

// City data stored in CosmosDB
export interface CityData {
  id: string;
  city: string;
  country: string;
  flag: string;
  region: RegionKey;
  enabled: boolean;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  imageUrls: string[];  // Array of city images for rotation in route builder
  // Legacy support - will be migrated to imageUrls
  imageUrl?: string;
  // AI-generated image arrays
  highlightImages?: string[];      // Array of URLs for highlight photos
  activityImages?: string[];       // Array of URLs for activity photos
  accommodationImages?: string[];  // Array of URLs for accommodation photos
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
  // Admin-controlled fields
  availableActivities: string[]; // Which activities can be selected for this city
  availableAccommodation: string[]; // Which accommodation types can be selected
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity type
export interface ActivityData {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  enabled: boolean;
}

// Accommodation type
export interface AccommodationData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  pros: string[];
  enabled: boolean;
}

const CITIES_CONTAINER_ID = 'cities';
const ACTIVITIES_CONTAINER_ID = 'activities';
const ACCOMMODATION_TYPES_CONTAINER_ID = 'accommodationTypes';

// City CRUD Operations
export async function getAllCities(region?: RegionKey): Promise<CityData[]> {
  // Check if CosmosDB is configured first
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    console.warn('[getAllCities] CosmosDB not configured, returning empty array');
    return [];
  }

  try {
    console.log('[getAllCities] Attempting to get container...');
    const container = await getContainer(CITIES_CONTAINER_ID);
    console.log('[getAllCities] Container obtained, querying...');
    
    // Query all enabled cities (cross-partition query)
    let query = 'SELECT * FROM c WHERE c.enabled = true';
    const params: any[] = [];
    
    if (region) {
      query += ' AND c.region = @region';
      params.push({ name: '@region', value: region });
    }
    
    query += ' ORDER BY c.city ASC';

    const querySpec = {
      query,
      parameters: params,
    };

    // Enable cross-partition query if no region filter
    const feedOptions = !region ? { enableCrossPartitionQuery: true } : undefined;

    console.log('[getAllCities] Executing query:', query);
    const { resources } = await container.items.query(querySpec, feedOptions).fetchAll();
    console.log('[getAllCities] Query successful, found', resources.length, 'cities');

    return resources as CityData[];
  } catch (error: any) {
    console.error('[getAllCities] Error fetching cities from CosmosDB:', error);
    console.error('[getAllCities] Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      endpoint: endpoint ? 'SET' : 'NOT SET',
      key: key ? 'SET' : 'NOT SET',
      stack: error.stack?.substring(0, 500), // First 500 chars of stack
    });
    // Fallback to empty array if CosmosDB fails
    return [];
  }
}

export async function getCity(cityId: string): Promise<CityData | null> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    return null;
  }

  try {
    const container = await getContainer(CITIES_CONTAINER_ID);
    // Use query instead of direct read since partition key is /region, not /id
    // We need to query across partitions to find the city by ID
    const { resources } = await container.items.query(
      {
        query: 'SELECT * FROM c WHERE c.id = @cityId',
        parameters: [
          { name: '@cityId', value: cityId }
        ],
      },
      { enableCrossPartitionQuery: true }
    ).fetchAll();
    
    return resources[0] as CityData | null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    console.error('Error fetching city:', error);
    return null;
  }
}

export async function getCityByName(cityName: string, region: RegionKey): Promise<CityData | null> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    return null;
  }

  try {
    const container = await getContainer(CITIES_CONTAINER_ID);
    const { resources } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.city = @cityName AND c.region = @region',
      parameters: [
        { name: '@cityName', value: cityName },
        { name: '@region', value: region },
      ],
      // No need for cross-partition since we're filtering by region (partition key)
    }).fetchAll();

    return resources[0] as CityData | null;
  } catch (error: any) {
    console.error('Error fetching city by name:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });
    return null;
  }
}

export async function saveCity(cityData: Omit<CityData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CityData> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    throw new Error('CosmosDB not configured');
  }

  const container = await getContainer(CITIES_CONTAINER_ID);
  const { nanoid } = await import('nanoid');
  
  const city: CityData = {
    ...cityData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(city);
  return resource as CityData;
}

export async function updateCity(cityId: string, updates: Partial<CityData>): Promise<CityData> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    throw new Error('CosmosDB not configured');
  }

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

  // Use region as partition key (not cityId)
  const { resource } = await container.item(cityId, existing.region).replace(updated);
  return resource as CityData;
}

export async function deleteCity(cityId: string): Promise<void> {
  const endpoint = process.env.COSMOSDB_ENDPOINT || '';
  const key = process.env.COSMOSDB_KEY || '';
  
  if (!endpoint || !key) {
    throw new Error('CosmosDB not configured');
  }

  const container = await getContainer(CITIES_CONTAINER_ID);
  
  // First get the city to find its region (partition key)
  const existing = await getCity(cityId);
  if (!existing) {
    throw new Error(`City ${cityId} not found`);
  }
  
  // Use region as partition key (not cityId)
  await container.item(cityId, existing.region).delete();
}

// Activity CRUD Operations
export async function getAllActivities(): Promise<ActivityData[]> {
  try {
    const container = await getContainer(ACTIVITIES_CONTAINER_ID);
    const { resources } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.enabled = true ORDER BY c.name ASC',
    }).fetchAll();
    return resources as ActivityData[];
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

// Accommodation CRUD Operations
export async function getAllAccommodationTypes(): Promise<AccommodationData[]> {
  try {
    const container = await getContainer(ACCOMMODATION_TYPES_CONTAINER_ID);
    const { resources } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.enabled = true ORDER BY c.name ASC',
    }).fetchAll();
    return resources as AccommodationData[];
  } catch (error: any) {
    console.error('Error fetching accommodation types:', error);
    return [];
  }
}

// Helper to convert CityData to CityPreset format (for compatibility)
/**
 * Check if a URL is a blob storage URL
 */
function isBlobUrl(url: string): boolean {
  return url.includes('.blob.core.windows.net');
}

/**
 * Prioritize blob URLs over external URLs
 * This ensures blob storage images are used when available
 */
function prioritizeBlobUrls(urls: string[]): string[] {
  const blobUrls = urls.filter(isBlobUrl);
  const externalUrls = urls.filter(url => !isBlobUrl(url));
  
  // If we have blob URLs, use them first, then external as fallback
  // Otherwise, return original order
  return blobUrls.length > 0 ? [...blobUrls, ...externalUrls] : urls;
}

export function cityDataToPreset(city: CityData): CityPreset {
  // Use imageUrls array if available, fallback to imageUrl for legacy support
  // The first image in imageUrls is always the PRIMARY image
  let imageUrls = city.imageUrls && city.imageUrls.length > 0 
    ? [...city.imageUrls] // Create a copy to avoid mutating original
    : city.imageUrl 
      ? [city.imageUrl] 
      : [];
  
  // If we have blob URLs, use ONLY blob URLs (don't mix with external URLs)
  // This ensures we always use blob storage when available
  const blobUrls = imageUrls.filter(isBlobUrl);
  const finalImageUrls = blobUrls.length > 0 ? blobUrls : imageUrls;
  
  // Primary image is always the first one (index 0)
  const imageUrl = finalImageUrls.length > 0 ? finalImageUrls[0] : '';
  
  return {
    city: city.city,
    country: city.country,
    flag: city.flag,
    budgetCoins: city.budgetCoins,
    tags: city.tags,
    imageUrl, // Primary image (first in array, prioritized to be blob URL if available)
    imageUrls: finalImageUrls.length > 1 ? finalImageUrls : undefined, // Only include if multiple images
    highlights: {
      places: city.highlights.places,
      accommodation: city.highlights.accommodation,
      activities: city.highlights.activities,
      notesHint: city.highlights.notesHint,
    },
    weather: city.weather,
    costs: city.costs,
    nomadScore: city.nomadScore,
    internetSpeed: city.internetSpeed,
  };
}

