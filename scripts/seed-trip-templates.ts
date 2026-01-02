/**
 * Seed Trip Templates to CosmosDB
 * 
 * This script migrates the hardcoded trip templates from src/lib/tripTemplates.ts
 * to CosmosDB for backend management.
 * 
 * Usage:
 *   npx tsx scripts/seed-trip-templates.ts
 */

import { createTripTemplate, getTripTemplates } from '../functions/shared/cosmos';
import { TRIP_TEMPLATES } from '../src/lib/tripTemplates';
import { RegionKey } from '../src/lib/cityPresets';

async function seedTripTemplates() {
  console.log('🌱 Starting Trip Templates seed...\n');

  const regions: RegionKey[] = ['europe', 'latin-america', 'southeast-asia'];
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const region of regions) {
    console.log(`📦 Processing ${region}...`);
    const staticTemplates = TRIP_TEMPLATES[region] || [];

    // Check existing templates
    const existingTemplates = await getTripTemplates({ region, enabled: true }).catch(() => []);
    const existingIds = new Set(existingTemplates.map(t => t.id));

    for (let i = 0; i < staticTemplates.length; i++) {
      const template = staticTemplates[i];
      
      if (existingIds.has(template.id)) {
        console.log(`  ⏭️  Skipping ${template.id} (already exists)`);
        totalSkipped++;
        continue;
      }

      try {
        await createTripTemplate({
          region: template.region,
          name: template.name,
          description: template.description,
          icon: template.icon,
          imageUrl: template.imageUrl,
          presetCities: template.presetCities,
          tags: template.tags,
          enabled: true,
          order: i,
        });
        console.log(`  ✅ Created ${template.id}: ${template.name}`);
        totalCreated++;
      } catch (error: any) {
        console.error(`  ❌ Error creating ${template.id}:`, error.message);
        totalErrors++;
      }
    }
    console.log('');
  }

  console.log('📊 Summary:');
  console.log(`  ✅ Created: ${totalCreated}`);
  console.log(`  ⏭️  Skipped: ${totalSkipped}`);
  console.log(`  ❌ Errors: ${totalErrors}`);
  console.log('\n✨ Seed complete!');
}

// Run the seed
seedTripTemplates().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

