/**
 * Migration script to import existing city data from cityPresets.ts into CosmosDB
 * 
 * Run with: npx tsx scripts/migrate-cities-to-cosmos.ts
 * 
 * Make sure COSMOSDB_ENDPOINT and COSMOSDB_KEY are set in your .env.local file
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { CosmosClient } from '@azure/cosmos';
import { CITY_PRESETS, RegionKey, CityPreset } from '../src/lib/cityPresets';
import { CityData } from '../src/lib/cosmos-cities';
import { nanoid } from 'nanoid';

// Load .env.local file
const result = config({ path: resolve(process.cwd(), '.env.local') });

if (result.error) {
  console.warn('Warning: Could not load .env.local:', result.error.message);
}

const endpoint = process.env.COSMOSDB_ENDPOINT || '';
const key = process.env.COSMOSDB_KEY || '';
const databaseId = process.env.COSMOSDB_DATABASE_ID || 'southbound';
const containerId = 'cities';

if (!endpoint || !key) {
  console.error('❌ Error: COSMOSDB_ENDPOINT and COSMOSDB_KEY must be set');
  console.error('\n📝 Please create a .env.local file in the project root with:');
  console.error('   COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/');
  console.error('   COSMOSDB_KEY=your-primary-key-here');
  console.error('   COSMOSDB_DATABASE_ID=southbound');
  console.error('\n💡 You can copy .env.local.example and fill in your values');
  console.error('\n🔍 Debug info:');
  console.error('   ENDPOINT found:', !!endpoint);
  console.error('   KEY found:', !!key);
  console.error('   File exists:', require('fs').existsSync(resolve(process.cwd(), '.env.local')));
  process.exit(1);
}

async function migrateCities() {
  console.log('🚀 Starting city migration to CosmosDB...\n');

  const client = new CosmosClient({ endpoint, key });
  
  try {
    // Get or create database
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    console.log(`✅ Database: ${databaseId}`);

    // Get or create container
    const { container } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: ['/region'] },
    });
    console.log(`✅ Container: ${containerId}\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    // Process each region
    for (const [regionKey, cities] of Object.entries(CITY_PRESETS) as [RegionKey, CityPreset[]][]) {
      console.log(`📦 Processing ${regionKey} (${cities.length} cities)...`);

      for (const cityPreset of cities) {
        try {
          // Check if city already exists
          const existing = await container.items
            .query({
              query: 'SELECT * FROM c WHERE c.city = @cityName AND c.region = @region',
              parameters: [
                { name: '@cityName', value: cityPreset.city },
                { name: '@region', value: regionKey },
              ],
            })
            .fetchAll();

          if (existing.resources.length > 0) {
            console.log(`  ⏭️  Skipping ${cityPreset.city} (already exists)`);
            skipped++;
            continue;
          }

          // Convert CityPreset to CityData
          const cityData: CityData = {
            id: nanoid(),
            city: cityPreset.city,
            country: cityPreset.country,
            flag: cityPreset.flag,
            region: regionKey,
            enabled: true,
            budgetCoins: cityPreset.budgetCoins,
            tags: cityPreset.tags,
            imageUrl: cityPreset.imageUrl,
            highlights: {
              places: cityPreset.highlights.places,
              accommodation: cityPreset.highlights.accommodation,
              activities: cityPreset.highlights.activities,
              notesHint: cityPreset.highlights.notesHint,
            },
            weather: cityPreset.weather,
            costs: cityPreset.costs,
            nomadScore: cityPreset.nomadScore,
            internetSpeed: cityPreset.internetSpeed,
            // Set all activities and accommodation as available by default
            availableActivities: cityPreset.highlights.activities || [],
            availableAccommodation: [cityPreset.highlights.accommodation].filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Insert into CosmosDB
          await container.items.create(cityData);
          console.log(`  ✅ Migrated ${cityPreset.city}, ${cityPreset.country}`);
          migrated++;
        } catch (error: any) {
          console.error(`  ❌ Error migrating ${cityPreset.city}:`, error.message);
          errors++;
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`  ✅ Migrated: ${migrated}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log('\n✨ Migration complete!');
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateCities().catch(console.error);
