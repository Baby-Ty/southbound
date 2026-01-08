/**
 * City data fetcher with CosmosDB + static fallback
 * This is the main entry point for getting city data throughout the app
 */

import { CityPreset, RegionKey } from './cityPresets';
import { getAllCities, cityDataToPreset, CityData, getCityByName } from './cosmos-cities';
import { CITY_PRESETS } from './cityPresets';

// Check if we're on the server side
function isServerSide(): boolean {
  return typeof window === 'undefined';
}

// Check if CosmosDB is configured (server-side only)
function isCosmosDBConfigured(): boolean {
  if (!isServerSide()) return false; // Can't check env vars on client
  return !!(
    process.env.COSMOSDB_ENDPOINT &&
    process.env.COSMOSDB_KEY &&
    process.env.COSMOSDB_ENDPOINT.trim() !== '' &&
    process.env.COSMOSDB_KEY.trim() !== ''
  );
}

/**
 * Get all cities for a region
 * Tries API endpoint (which uses CosmosDB) first, falls back to static data
 */
export async function getCitiesForRegion(region: RegionKey): Promise<CityPreset[]> {
  // On client side, use API endpoint
  if (!isServerSide()) {
    try {
      const { apiUrl } = await import('./api');
      const response = await fetch(apiUrl(`cities?region=${region}`));
      if (response.ok) {
        const data = await response.json();
        if (data.cities && data.cities.length > 0) {
          console.log(`[getCitiesForRegion] Loaded ${data.cities.length} cities from API for region: ${region}`);
          // Convert CityData to CityPreset
          const presets = data.cities.map((city: CityData) => cityDataToPreset(city));
          // Log blob URL usage
          const blobCount = presets.filter((p: CityPreset) => p.imageUrl?.includes('.blob.core.windows.net')).length;
          console.log(`[getCitiesForRegion] ${blobCount}/${presets.length} cities using blob URLs`);
          return presets;
        } else {
          console.warn(`[getCitiesForRegion] API returned empty cities array for region: ${region}`);
        }
      } else {
        console.warn(`[getCitiesForRegion] API request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.warn('[getCitiesForRegion] Failed to fetch cities from API, using static data:', error);
    }
  } else {
    // On server side, try CosmosDB directly
    if (isCosmosDBConfigured()) {
      try {
        const cities = await getAllCities(region);
        if (cities.length > 0) {
          console.log(`[getCitiesForRegion] Loaded ${cities.length} cities from CosmosDB for region: ${region}`);
          return cities.map(cityDataToPreset);
        }
      } catch (error) {
        console.warn('[getCitiesForRegion] Failed to fetch cities from CosmosDB, using static data:', error);
      }
    }
  }

  // Fallback to static data
  console.warn(`[getCitiesForRegion] Using static CITY_PRESETS fallback for region: ${region}`);
  return CITY_PRESETS[region] || [];
}

/**
 * Get city ID by city name and region
 * Returns null if city not found
 */
export async function getCityIdByName(
  cityName: string,
  region: RegionKey
): Promise<string | null> {
  if (!isServerSide()) {
    // On client side, use API endpoint
    try {
      const { apiUrl } = await import('./api');
      const response = await fetch(apiUrl(`cities?region=${region}`));
      if (response.ok) {
        const data = await response.json();
        const city = data.cities?.find((c: CityData) => c.city === cityName);
        return city?.id || null;
      }
    } catch (error) {
      console.warn('[getCityIdByName] Failed to fetch city ID from API:', error);
    }
  } else {
    // On server side, try CosmosDB directly
    if (isCosmosDBConfigured()) {
      try {
        const city = await getCityByName(cityName, region);
        return city?.id || null;
      } catch (error) {
        console.warn('[getCityIdByName] Failed to fetch city ID from CosmosDB:', error);
      }
    }
  }

  return null;
}

/**
 * Get all cities (all regions)
 */
export async function getAllCitiesData(): Promise<CityPreset[]> {
  if (isCosmosDBConfigured()) {
    try {
      const cities = await getAllCities();
      if (cities.length > 0) {
        return cities.map(cityDataToPreset);
      }
    } catch (error) {
      console.warn('Failed to fetch cities from CosmosDB, using static data:', error);
    }
  }

  // Fallback to static data
  return Object.values(CITY_PRESETS).flat();
}

/**
 * Get available activities for a specific city
 * Returns only activities that are enabled for that city
 */
export async function getAvailableActivitiesForCity(
  cityName: string,
  region: RegionKey
): Promise<string[]> {
  if (isCosmosDBConfigured()) {
    try {
      const city = await getCityByName(cityName, region);
      if (city && city.availableActivities) {
        return city.availableActivities;
      }
    } catch (error) {
      console.warn('Failed to fetch city activities from CosmosDB:', error);
    }
  }

  // Fallback: return all activities from static data
  const staticCity = CITY_PRESETS[region]?.find((c) => c.city === cityName);
  return staticCity?.highlights.activities || [];
}

/**
 * Get available accommodation types for a specific city
 */
export async function getAvailableAccommodationForCity(
  cityName: string,
  region: RegionKey
): Promise<string[]> {
  if (isCosmosDBConfigured()) {
    try {
      const city = await getCityByName(cityName, region);
      if (city && city.availableAccommodation) {
        return city.availableAccommodation;
      }
    } catch (error) {
      console.warn('Failed to fetch city accommodation from CosmosDB:', error);
    }
  }

  // Fallback: return accommodation from static data
  const staticCity = CITY_PRESETS[region]?.find((c) => c.city === cityName);
  return staticCity?.highlights.accommodation ? [staticCity.highlights.accommodation] : [];
}
