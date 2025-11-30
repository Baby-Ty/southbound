import { client } from './sanity';
import { CityPreset, RegionKey } from './cityPresets';

// Query regions
export async function getRegions() {
  const query = `*[_type == "region" && enabled == true] | order(name asc) {
    _id,
    name,
    slug,
    description,
    "imageUrl": image.asset->url,
    timezone,
    budgetLabel,
    budgetSymbol,
    vibe,
    enabled
  }`;
  
  return await client.fetch(query);
}

// Query cities by region
export async function getCitiesByRegion(regionSlug: string): Promise<CityPreset[]> {
  const query = `*[_type == "city" && enabled == true && region->slug.current == $regionSlug] | order(name asc) {
    _id,
    name,
    country,
    flag,
    "imageUrl": image.asset->url,
    budgetCoins,
    tags,
    highlights {
      places,
      accommodation,
      "activities": activities[]->name,
      notesHint
    },
    weather {
      avgTemp,
      bestMonths,
      climate
    },
    costs {
      accommodation,
      coworking,
      meals,
      monthlyTotal
    },
    nomadScore,
    internetSpeed,
    "availableAccommodation": availableAccommodation[]->name
  }`;
  
  const cities = await client.fetch(query, { regionSlug });
  
  // Transform to CityPreset format
  return cities.map((city: any) => ({
    city: city.name,
    country: city.country,
    flag: city.flag || '🌍',
    budgetCoins: city.budgetCoins as 1 | 2 | 3,
    tags: city.tags || [],
    imageUrl: city.imageUrl || '',
    highlights: {
      places: city.highlights?.places || [],
      accommodation: city.highlights?.accommodation || '',
      activities: city.highlights?.activities || [],
      notesHint: city.highlights?.notesHint || '',
    },
    weather: {
      avgTemp: city.weather?.avgTemp || '',
      bestMonths: city.weather?.bestMonths || '',
      climate: city.weather?.climate || 'temperate',
    },
    costs: {
      accommodation: city.costs?.accommodation || '',
      coworking: city.costs?.coworking || '',
      meals: city.costs?.meals || '',
      monthlyTotal: city.costs?.monthlyTotal || '',
    },
    nomadScore: city.nomadScore || 0,
    internetSpeed: city.internetSpeed || '',
  }));
}

// Query all activities
export async function getActivities() {
  const query = `*[_type == "activity" && enabled == true] | order(name asc) {
    _id,
    name,
    description,
    icon,
    category,
    enabled
  }`;
  
  return await client.fetch(query);
}

// Query all accommodation types
export async function getAccommodationTypes() {
  const query = `*[_type == "accommodationType" && enabled == true] | order(name asc) {
    _id,
    name,
    description,
    "imageUrl": image.asset->url,
    pros,
    enabled
  }`;
  
  return await client.fetch(query);
}

// Helper to get region key from slug
export function getRegionKeyFromSlug(slug: string): RegionKey {
  const slugMap: Record<string, RegionKey> = {
    'europe': 'europe',
    'latin-america': 'latin-america',
    'southeast-asia': 'southeast-asia',
  };
  return slugMap[slug] || 'latin-america';
}

