/**
 * Test CosmosDB Update Directly
 * 
 * This bypasses Azure Functions and tests the CosmosDB update directly
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

const templateId = 'gykBMT5XVJPlq6ttx7yk8';
const region = 'southeast-asia';

async function testUpdate() {
  console.log(`🧪 Testing direct CosmosDB update for ${templateId}...\n`);

  try {
    // Get existing
    const existing = await getTripTemplateById(templateId, region);
    if (!existing) {
      console.error(`❌ Template not found`);
      process.exit(1);
    }

    console.log(`Current state:`);
    console.log(`  isCurated: ${existing.isCurated}`);
    console.log(`  curatedOrder: ${existing.curatedOrder}`);
    console.log('');

    // Update it
    console.log(`Updating with isCurated: true, curatedOrder: 3...`);
    const updated = await updateTripTemplate(templateId, region, {
      isCurated: true,
      curatedOrder: 3,
    });

    console.log(`\n✅ Update completed!`);
    console.log(`New state:`);
    console.log(`  isCurated: ${updated.isCurated}`);
    console.log(`  curatedOrder: ${updated.curatedOrder}`);
    console.log(`  updatedAt: ${updated.updatedAt}`);

    // Verify it was saved
    const verified = await getTripTemplateById(templateId, region);
    console.log(`\n🔍 Verification read:`);
    console.log(`  isCurated: ${verified?.isCurated}`);
    console.log(`  curatedOrder: ${verified?.curatedOrder}`);

    if (verified?.isCurated === true && verified?.curatedOrder === 3) {
      console.log(`\n✅ SUCCESS! Fields were saved correctly.`);
    } else {
      console.log(`\n❌ FAILED! Fields were not saved correctly.`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testUpdate();
