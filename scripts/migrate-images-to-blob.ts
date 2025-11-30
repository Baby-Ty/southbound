/**
 * Migration script to move all city images from URLs to Azure Blob Storage
 * 
 * Usage:
 *   npm run migrate-images [--dry-run] [--city-id=<id>]
 * 
 * Or call the API endpoint:
 *   POST /api/migrate-images
 *   Body: { cityId?: string, dryRun?: boolean }
 */

// Load environment variables
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local first, then .env
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import { getAllCities, getCity, updateCity } from '../src/lib/cosmos-cities';
import { uploadImageFromUrl } from '../src/lib/azureBlob';

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
    console.log(`  ✓ Migrated: ${imageUrl.substring(0, 60)}... -> ${blobUrl.substring(0, 60)}...`);
    return blobUrl;
  } catch (error: any) {
    console.error(`  ✗ Failed to migrate: ${imageUrl}`, error.message);
    return imageUrl;
  }
}

async function migrateCityImages(city: any, dryRun: boolean = false) {
  console.log(`\nMigrating images for: ${city.city}, ${city.country}`);
  const updates: any = {};
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
      city.imageUrls.map((url: string) => migrateImageUrl(url, 'cities', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url: string, idx: number) => url !== city.imageUrls[idx]);
    if (urlsChanged) {
      updates.imageUrls = migratedUrls;
      hasChanges = true;
    }
  }

  // Migrate highlight images
  if (city.highlightImages && city.highlightImages.length > 0) {
    const migratedUrls = await Promise.all(
      city.highlightImages.map((url: string) => migrateImageUrl(url, 'highlights', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url: string, idx: number) => url !== city.highlightImages[idx]);
    if (urlsChanged) {
      updates.highlightImages = migratedUrls;
      hasChanges = true;
    }
  }

  // Migrate activity images
  if (city.activityImages && city.activityImages.length > 0) {
    const migratedUrls = await Promise.all(
      city.activityImages.map((url: string) => migrateImageUrl(url, 'activities', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url: string, idx: number) => url !== city.activityImages[idx]);
    if (urlsChanged) {
      updates.activityImages = migratedUrls;
      hasChanges = true;
    }
  }

  // Migrate accommodation images
  if (city.accommodationImages && city.accommodationImages.length > 0) {
    const migratedUrls = await Promise.all(
      city.accommodationImages.map((url: string) => migrateImageUrl(url, 'accommodations', city.city))
    );
    
    const urlsChanged = migratedUrls.some((url: string, idx: number) => url !== city.accommodationImages[idx]);
    if (urlsChanged) {
      updates.accommodationImages = migratedUrls;
      hasChanges = true;
    }
  }

  if (hasChanges && !dryRun) {
    await updateCity(city.id, updates);
    console.log(`  ✓ Updated city in database`);
  } else if (hasChanges && dryRun) {
    console.log(`  ⚠ Would update (dry run):`, Object.keys(updates));
  } else {
    console.log(`  → No changes needed (already migrated)`);
  }

  return hasChanges;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const cityIdArg = args.find(arg => arg.startsWith('--city-id='));
  const cityId = cityIdArg ? cityIdArg.split('=')[1] : undefined;

  console.log('🚀 Starting image migration to Azure Blob Storage');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be saved)' : 'LIVE (changes will be saved)'}`);
  
  if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
    console.error('❌ Error: AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
    process.exit(1);
  }

  try {
    if (cityId) {
      // Migrate single city
      const city = await getCity(cityId);
      if (!city) {
        console.error(`❌ City with ID ${cityId} not found`);
        process.exit(1);
      }
      await migrateCityImages(city, dryRun);
    } else {
      // Migrate all cities
      const cities = await getAllCities();
      console.log(`\nFound ${cities.length} cities to process\n`);
      
      let migrated = 0;
      let skipped = 0;
      let failed = 0;

      for (const city of cities) {
        try {
          const changed = await migrateCityImages(city, dryRun);
          if (changed) migrated++;
          else skipped++;
        } catch (error: any) {
          failed++;
          console.error(`  ✗ Error migrating ${city.city}:`, error.message);
        }
      }

      console.log(`\n📊 Migration Summary:`);
      console.log(`   Total: ${cities.length}`);
      console.log(`   ${dryRun ? 'Would migrate' : 'Migrated'}: ${migrated}`);
      console.log(`   Skipped (already migrated): ${skipped}`);
      console.log(`   Failed: ${failed}`);
    }

    console.log(`\n✅ Migration ${dryRun ? 'dry run' : ''} completed!`);
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { migrateCityImages, migrateImageUrl };

