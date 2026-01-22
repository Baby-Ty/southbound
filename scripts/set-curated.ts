/**
 * Manually Set Template as Curated
 * 
 * This script manually updates a template to be curated (for testing)
 * 
 * Usage:
 *   npx tsx scripts/set-curated.ts <template-id> <region> <order>
 * 
 * Example:
 *   npx tsx scripts/set-curated.ts hsTgt9bQbo-iEU4wH-wB7 europe 1
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { updateTripTemplate, getTripTemplateById } from '../functions/shared/cosmos';

// Load .env.local file
const result = config({ path: resolve(process.cwd(), '.env.local') });

if (result.error) {
  console.warn('Warning: Could not load .env.local:', result.error.message);
}

if (!process.env.COSMOSDB_ENDPOINT || !process.env.COSMOSDB_KEY) {
  console.error('❌ Error: COSMOSDB_ENDPOINT and COSMOSDB_KEY must be set');
  process.exit(1);
}

const templateId = process.argv[2];
const region = process.argv[3] as 'europe' | 'latin-america' | 'southeast-asia';
const order = parseInt(process.argv[4]);

if (!templateId || !region || isNaN(order)) {
  console.error('Usage: npx tsx scripts/set-curated.ts <template-id> <region> <order>');
  console.error('\nExample:');
  console.error('  npx tsx scripts/set-curated.ts hsTgt9bQbo-iEU4wH-wB7 europe 1');
  process.exit(1);
}

async function setCurated() {
  console.log(`🔧 Setting template ${templateId} as curated...\n`);

  try {
    // First, get the template to verify it exists
    const existing = await getTripTemplateById(templateId, region);
    
    if (!existing) {
      console.error(`❌ Template ${templateId} not found in region ${region}`);
      process.exit(1);
    }

    console.log(`Found template: ${existing.name}`);
    console.log(`Current status: ${existing.isCurated ? 'Curated' : 'Not Curated'}`);
    console.log('');

    // Update it
    const updated = await updateTripTemplate(templateId, region, {
      isCurated: true,
      curatedOrder: order,
      price: 'R25,000/mo',
      vibe: 'Amazing Adventure',
      internetSpeed: '50 Mbps',
      safetyRating: '4.5/5',
      avgWeather: '25°C',
      bestFor: 'Digital Nomads',
    });

    console.log('✅ Successfully updated!');
    console.log('New status:');
    console.log(`  Curated: ${updated.isCurated ? 'Yes' : 'No'}`);
    console.log(`  Order: ${updated.curatedOrder}`);
    console.log(`  Price: ${updated.price}`);
    console.log(`  Vibe: ${updated.vibe}`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setCurated();
