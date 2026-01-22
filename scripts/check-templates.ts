/**
 * Check Trip Templates Status
 * 
 * This script checks if templates exist in CosmosDB and shows their IDs
 * 
 * Usage:
 *   npx tsx scripts/check-templates.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { getTripTemplates } from '../functions/shared/cosmos';

// Load .env.local file
const result = config({ path: resolve(process.cwd(), '.env.local') });

if (result.error) {
  console.warn('Warning: Could not load .env.local:', result.error.message);
}

if (!process.env.COSMOSDB_ENDPOINT || !process.env.COSMOSDB_KEY) {
  console.error('❌ Error: COSMOSDB_ENDPOINT and COSMOSDB_KEY must be set');
  console.error('\n📝 Please create a .env.local file in the project root with:');
  console.error('   COSMOSDB_ENDPOINT=<your-endpoint>');
  console.error('   COSMOSDB_KEY=<your-key>\n');
  process.exit(1);
}

async function checkTemplates() {
  console.log('🔍 Checking Trip Templates in CosmosDB...\n');

  const regions: ('europe' | 'latin-america' | 'southeast-asia')[] = ['europe', 'latin-america', 'southeast-asia'];
  let totalTemplates = 0;

  for (const region of regions) {
    console.log(`\n📦 ${region.toUpperCase()}`);
    console.log('─'.repeat(60));
    
    try {
      const templates = await getTripTemplates({ region, enabled: true });
      
      if (templates.length === 0) {
        console.log('  ⚠️  No templates found');
      } else {
        templates.forEach((template, idx) => {
          console.log(`  ${idx + 1}. ${template.name}`);
          console.log(`     ID: ${template.id}`);
          console.log(`     Curated: ${template.isCurated ? '✅ Yes' : '❌ No'}`);
          if (template.isCurated) {
            console.log(`     Order: ${template.curatedOrder ?? 'Not set'}`);
          }
        });
        totalTemplates += templates.length;
      }
    } catch (error: any) {
      console.error(`  ❌ Error fetching templates:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Total Templates: ${totalTemplates}`);
  
  if (totalTemplates === 0) {
    console.log('\n⚠️  No templates found in CosmosDB!');
    console.log('💡 Run the seed script to populate templates:');
    console.log('   npx tsx scripts/seed-trip-templates.ts');
  } else {
    console.log('\n✅ Templates are loaded in CosmosDB');
  }
}

checkTemplates().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
