/**
 * Migration script to add detour fields to existing cities
 * 
 * This script:
 * 1. Adds isDetour: false to all existing cities
 * 2. Sets suggestedDuration: 4 for existing cities
 * 3. Identifies detour candidates (Ubud, Gili T, etc.) and flags them manually
 * 
 * Run with: npx tsx scripts/migrate-add-detour-fields.ts
 */

import { getAllCities, updateCity, CityData } from '../src/lib/cosmos-cities';

// Known detour cities that should be flagged
const DETOUR_CITIES: Record<string, { nearbyCity: string; suggestedDuration: number }> = {
  'Ubud': { nearbyCity: 'Bali (Canggu)', suggestedDuration: 1.5 },
  'Gili T': { nearbyCity: 'Bali (Canggu)', suggestedDuration: 1.5 },
  'Gili Trawangan': { nearbyCity: 'Bali (Canggu)', suggestedDuration: 1.5 },
  'Siem Reap': { nearbyCity: 'Phnom Penh', suggestedDuration: 1.5 },
  // Add more detour cities as needed
};

async function migrateCities() {
  console.log('Starting migration: Adding detour fields to cities...\n');

  try {
    const cities = await getAllCities();
    console.log(`Found ${cities.length} cities to process\n`);

    let updated = 0;
    let skipped = 0;

    for (const city of cities) {
      const needsUpdate = 
        city.isDetour === undefined ||
        city.suggestedDuration === undefined ||
        DETOUR_CITIES[city.city] !== undefined;

      if (!needsUpdate) {
        skipped++;
        continue;
      }

      const updates: Partial<CityData> = {};

      // Check if this is a known detour city
      const detourInfo = DETOUR_CITIES[city.city];
      if (detourInfo) {
        updates.isDetour = true;
        updates.nearbyCity = detourInfo.nearbyCity;
        updates.suggestedDuration = detourInfo.suggestedDuration;
        console.log(`✓ Flagging ${city.city} as detour (near ${detourInfo.nearbyCity})`);
      } else {
        // Default: not a detour, 4 weeks
        if (city.isDetour === undefined) {
          updates.isDetour = false;
        }
        if (city.suggestedDuration === undefined) {
          updates.suggestedDuration = 4;
        }
      }

      if (Object.keys(updates).length > 0) {
        await updateCity(city.id, updates);
        updated++;
      } else {
        skipped++;
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`  - Updated: ${updated} cities`);
    console.log(`  - Skipped: ${skipped} cities (already up to date)`);
  } catch (error: any) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

migrateCities();
