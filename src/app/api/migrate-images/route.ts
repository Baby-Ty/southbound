import { NextRequest, NextResponse } from 'next/server';
import { getAllCities, updateCity, CityData } from '@/lib/cosmos-cities';
import { uploadImageFromUrl } from '@/lib/azureBlob';
import { corsHeaders, handleOptions } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * Check if a URL is already a blob storage URL
 */
function isBlobUrl(url: string): boolean {
  if (!url) return false;
  // Check if it's an Azure Blob Storage URL
  return url.includes('.blob.core.windows.net') || url.includes('blob.core.windows.net');
}

/**
 * Check if a URL is an external URL that should be migrated
 */
function shouldMigrate(url: string): boolean {
  if (!url) return false;
  if (isBlobUrl(url)) return false;
  // Migrate Unsplash URLs and other external URLs
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Migrate a single image URL to blob storage
 */
async function migrateImageUrl(
  imageUrl: string,
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
  cityName?: string
): Promise<string> {
  if (!shouldMigrate(imageUrl)) {
    return imageUrl; // Already a blob URL or invalid
  }

  try {
    const filename = cityName 
      ? `${category}/${cityName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
      : undefined;
    
    const blobUrl = await uploadImageFromUrl(imageUrl, category, filename);
    console.log(`Migrated: ${imageUrl} -> ${blobUrl}`);
    return blobUrl;
  } catch (error: any) {
    console.error(`Failed to migrate image ${imageUrl}:`, error.message);
    // Return original URL if migration fails
    return imageUrl;
  }
}

/**
 * Migrate all images for a city
 */
async function migrateCityImages(city: CityData): Promise<Partial<CityData>> {
  const updates: Partial<CityData> = {};
  let hasChanges = false;

  // Migrate primary imageUrl
  if (city.imageUrl && shouldMigrate(city.imageUrl)) {
    const migratedUrl = await migrateImageUrl(city.imageUrl, 'cities', city.city);
    if (migratedUrl !== city.imageUrl) {
      updates.imageUrl = migratedUrl;
      hasChanges = true;
    }
  }

  // Migrate imageUrls array
  if (city.imageUrls && city.imageUrls.length > 0) {
    const migratedUrls = await Promise.all(
      city.imageUrls.map(url => migrateImageUrl(url, 'cities', city.city))
    );
    
    // Check if any URLs changed
    const urlsChanged = migratedUrls.some((url, idx) => url !== city.imageUrls![idx]);
    if (urlsChanged) {
      updates.imageUrls = migratedUrls;
      hasChanges = true;
    }
  }

  // Migrate highlight images
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

  // Migrate activity images
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

  // Migrate accommodation images
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cityId, dryRun = false } = body;

    // Check Azure Blob Storage is configured
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      return NextResponse.json(
        { error: 'Azure Blob Storage is not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (cityId) {
      // Migrate a single city
      const { getCity } = await import('@/lib/cosmos-cities');
      const city = await getCity(cityId);
      
      if (!city) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404, headers: corsHeaders }
        );
      }

      const updates = await migrateCityImages(city);
      
      if (dryRun) {
        return NextResponse.json({
          success: true,
          dryRun: true,
          city: city.city,
          updates,
          message: 'Dry run completed. No changes were saved.',
        }, { headers: corsHeaders });
      }

      if (Object.keys(updates).length > 0) {
        await updateCity(cityId, updates);
        return NextResponse.json({
          success: true,
          city: city.city,
          updates,
          message: 'City images migrated successfully',
        }, { headers: corsHeaders });
      }

      return NextResponse.json({
        success: true,
        city: city.city,
        message: 'No images needed migration (all already in blob storage)',
      }, { headers: corsHeaders });
    } else {
      // Migrate all cities
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

      return NextResponse.json({
        success: true,
        dryRun,
        results,
        message: dryRun 
          ? 'Dry run completed. No changes were saved.'
          : 'Migration completed',
      }, { headers: corsHeaders });
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to migrate images',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

