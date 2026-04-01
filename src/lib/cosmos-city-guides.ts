import { getContainer } from './cosmos';
import type { CityData } from '@/data/cities';

const CONTAINER = 'city-guides';

export interface CityGuideRecord extends CityData {
  id: string;        // same as slug
  updatedAt: string;
}

export async function getCityGuide(slug: string): Promise<CityGuideRecord | null> {
  try {
    const container = await getContainer(CONTAINER);
    const { resource } = await container.item(slug, slug).read<CityGuideRecord>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) return null;
    throw error;
  }
}

export async function saveCityGuide(slug: string, data: Partial<CityData>): Promise<CityGuideRecord> {
  const container = await getContainer(CONTAINER);
  const record: CityGuideRecord = {
    ...(data as CityData),
    id: slug,
    updatedAt: new Date().toISOString(),
  };
  await container.items.upsert(record);
  return record;
}

export async function getAllCityGuides(): Promise<CityGuideRecord[]> {
  try {
    const container = await getContainer(CONTAINER);
    const { resources } = await container.items
      .query('SELECT * FROM c')
      .fetchAll();
    return resources;
  } catch {
    return [];
  }
}
