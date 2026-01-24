import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getAllCities, updateCity, CityData } from '../shared/cosmos-cities';
import { uploadImageFromUrl } from '../shared/azureBlob';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function isBlobUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('.blob.core.windows.net') || url.includes('blob.core.windows.net');
}

function shouldMigrate(url: string): boolean {
  if (!url) return false;
  if (isBlobUrl(url)) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

async function migrateImageUrl(
  imageUrl: string,
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
  cityName?: string
): Promise<string> {
  if (!shouldMigrate(imageUrl)) {
    return imageUrl;
  }

  try {
    const filename = cityName 
      ? `${category}/${cityName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
      : undefined;
    
    const blobUrl = await uploadImageFromUrl(imageUrl, category, filename);
    return blobUrl;
  } catch (error: any) {
    console.error(`Failed to migrate image ${imageUrl}:`, error.message);
    return imageUrl;
  }
}

async function migrateCityImages(city: CityData): Promise<Partial<CityData>> {
  const updates: Partial<CityData> = {};
  let hasChanges = false;

  if (city.imageUrl && shouldMigrate(city.imageUrl)) {
    const migratedUrl = await migrateImageUrl(city.imageUrl, 'cities', city.city);
    if (migratedUrl !== city.imageUrl) {
      updates.imageUrl = migratedUrl;
      hasChanges = true;
    }
  }

  if (city.imageUrls && city.imageUrls.length > 0) {
    const migratedUrls = await Promise.all(
      city.imageUrls.map(url => migrateImageUrl(url, 'cities', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url, idx) => url !== city.imageUrls![idx]);
    if (urlsChanged) {
      updates.imageUrls = migratedUrls;
      hasChanges = true;
    }
  }

  if (city.highlightImages && city.highlightImages.length > 0) {
    const migratedUrls = await Promise.all(
      city.highlightImages.map(url => migrateImageUrl(url, 'highlights', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url, idx) => url !== city.highlightImages![idx]);
    if (urlsChanged) {
      updates.highlightImages = migratedUrls;
      hasChanges = true;
    }
  }

  if (city.activityImages && city.activityImages.length > 0) {
    const migratedUrls = await Promise.all(
      city.activityImages.map(url => migrateImageUrl(url, 'activities', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url, idx) => url !== city.activityImages![idx]);
    if (urlsChanged) {
      updates.activityImages = migratedUrls;
      hasChanges = true;
    }
  }

  if (city.accommodationImages && city.accommodationImages.length > 0) {
    const migratedUrls = await Promise.all(
      city.accommodationImages.map(url => migrateImageUrl(url, 'accommodations', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url, idx) => url !== city.accommodationImages![idx]);
    if (urlsChanged) {
      updates.accommodationImages = migratedUrls;
      hasChanges = true;
    }
  }

  return hasChanges ? updates : {};
}

export async function migrateImages(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  try {
    const body = req.body as {
      cityId?: string;
      dryRun?: boolean;
    };
    const { cityId, dryRun = false } = body;

    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      (context as any).res = createCorsResponse(
        { error: 'Azure Blob Storage is not configured' },
        500
      ); return;
    }

    if (cityId) {
      const { getCity } = await import('../shared/cosmos-cities');
      const city = await getCity(cityId);
      
      if (!city) {
        (context as any).res = createCorsResponse(
          { error: 'City not found' },
          404
        ); return;
      }

      const updates = await migrateCityImages(city);
      
      if (dryRun) {
        (context as any).res = createCorsResponse({
          success: true,
          dryRun: true,
          city: city.city,
          updates,
          message: 'Dry run completed. No changes were saved.',
        }); return;
      }

      if (Object.keys(updates).length > 0) {
        await updateCity(cityId, updates);
        (context as any).res = createCorsResponse({
          success: true,
          city: city.city,
          updates,
          message: 'City images migrated successfully',
        }); return;
      }

      (context as any).res = createCorsResponse({
        success: true,
        city: city.city,
        message: 'No images needed migration (all already in blob storage)',
      }); return;
    } else {
      const cities = await getAllCities();
      const results = {
        total: cities.length,
        migrated: 0,
        skipped: 0,
        failed: 0,
        details: [] as Array<{ city: string; status: string; updates?: Partial<CityData> }>,
      };

      for (const city of cities) {
        try {
          const updates = await migrateCityImages(city);
          
          if (dryRun) {
            if (Object.keys(updates).length > 0) {
              results.migrated++;
              results.details.push({
                city: city.city,
                status: 'would migrate',
                updates,
              });
            } else {
              results.skipped++;
              results.details.push({
                city: city.city,
                status: 'already migrated',
              });
            }
          } else {
            if (Object.keys(updates).length > 0) {
              await updateCity(city.id, updates);
              results.migrated++;
              results.details.push({
                city: city.city,
                status: 'migrated',
                updates,
              });
            } else {
              results.skipped++;
              results.details.push({
                city: city.city,
                status: 'already migrated',
              });
            }
          }
        } catch (error: any) {
          results.failed++;
          results.details.push({
            city: city.city,
            status: `failed: ${error.message}`,
          });
        }
      }

      (context as any).res = createCorsResponse({
        success: true,
        dryRun,
        results,
        message: dryRun 
          ? 'Dry run completed. No changes were saved.'
          : 'Migration completed',
      }); return;
    }
  } catch (error: any) {
    context.log(`Migration error: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse(
      { 
        error: error.message || 'Failed to migrate images',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    ); return;
  }
}

module.exports = { migrateImages };
