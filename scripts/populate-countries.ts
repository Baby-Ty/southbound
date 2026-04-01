/**
 * Migration script to populate countries from existing cities
 * 
 * This script extracts unique countries from existing cities and creates Country entities.
 * 
 * Run with: npx tsx scripts/populate-countries.ts
 * 
 * Make sure COSMOSDB_ENDPOINT and COSMOSDB_KEY are set in your .env.local file
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { getAllCities } from '../src/lib/cosmos-cities';
import { getAllCountries, saveCountry, CountryData } from '../src/lib/cosmos-countries';
import { RegionKey } from '../src/lib/cityPresets';

// Load .env.local file
const result = config({ path: resolve(process.cwd(), '.env.local') });
if (result.error) {
  console.warn('Warning: Could not load .env.local:', result.error.message);
}

// Country flags mapping
const COUNTRY_FLAGS: Record<string, string> = {
  'Indonesia': '🇮🇩',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Cambodia': '🇰🇭',
  'Philippines': '🇵🇭',
  'Mexico': '🇲🇽',
  'Colombia': '🇨🇴',
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Peru': '🇵🇪',
  'Chile': '🇨🇱',
  'Uruguay': '🇺🇾',
  'Portugal': '🇵🇹',
  'Spain': '🇪🇸',
  'Croatia': '🇭🇷',
  'Greece': '🇬🇷',
  'Hungary': '🇭🇺',
  'Czech Republic': '🇨🇿',
  'Germany': '🇩🇪',
  'Netherlands': '🇳🇱',
  'Italy': '🇮🇹',
};

async function populateCountries() {
  console.log('Starting migration: Populating countries from cities...\n');
  console.log('Environment check:');
  console.log('  COSMOSDB_ENDPOINT:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
  console.log('  COSMOSDB_KEY:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');
  console.log('  COSMOSDB_DATABASE_ID:', process.env.COSMOSDB_DATABASE_ID || 'NOT SET');
  console.log('');

  try {
    console.log('Fetching cities...');
    const cities = await getAllCities();
    console.log('Fetching existing countries...');
    const existingCountries = await getAllCountries();

    console.log(`Found ${cities.length} cities`);
    console.log(`Found ${existingCountries.length} existing countries\n`);

    // Extract unique countries by region
    const countriesByRegion = new Map<RegionKey, Set<string>>();
    
    for (const city of cities) {
      if (!countriesByRegion.has(city.region)) {
        countriesByRegion.set(city.region, new Set());
      }
      countriesByRegion.get(city.region)!.add(city.country);
    }

    let created = 0;
    let skipped = 0;

    for (const [region, countryNames] of countriesByRegion.entries()) {
      console.log(`\nProcessing ${region}:`);
      
      for (const countryName of countryNames) {
        // Check if country already exists
        const exists = existingCountries.find(c => c.name === countryName && c.region === region);
        
        if (exists) {
          console.log(`  ⏭  Skipping ${countryName} (already exists)`);
          skipped++;
          continue;
        }

        const flag = COUNTRY_FLAGS[countryName] || '🏳️';
        
        const countryData: Omit<CountryData, 'id' | 'createdAt' | 'updatedAt'> = {
          name: countryName,
          flag,
          region,
          enabled: true,
          description: '',
        };

        await saveCountry(countryData);
        console.log(`  ✓ Created ${flag} ${countryName}`);
        created++;
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`  - Created: ${created} countries`);
    console.log(`  - Skipped: ${skipped} countries (already exist)`);
  } catch (error: any) {
    console.error('✗ Migration failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Run the migration
populateCountries().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
