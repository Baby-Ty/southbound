/**
 * Seed Route Cards to CosmosDB
 * 
 * This script migrates the hardcoded route cards from src/components/discover/RegionSelector.tsx
 * to CosmosDB for backend management.
 * 
 * Usage:
 *   npx tsx scripts/seed-route-cards.ts
 * 
 * Make sure COSMOSDB_ENDPOINT and COSMOSDB_KEY are set in your .env.local file
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createRouteCard, getRouteCards } from '../functions/shared/cosmos';

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

// Hardcoded route cards data from RegionSelector.tsx
const ROUTE_CARDS = [
  {
    region: 'latin-america' as const,
    name: 'Latin America',
    tagline: 'Rhythm, culture, and endless adventure.',
    icon: '🌎',
    imageUrl: '/SouthAmerica.webp',
    budget: '$$',
    budgetLabel: 'Value',
    timezone: '-2h to -5h',
    vibe: 'Social & Adventurous',
    overview: 'Latin America is a vibrant tapestry of cultures, offering everything from the white-sand beaches of the Caribbean to the rugged peaks of the Andes.',
    featuredCities: [],
    enabled: true,
    order: 0,
  },
  {
    region: 'southeast-asia' as const,
    name: 'Southeast Asia',
    tagline: 'Tropical paradises and incredible food.',
    icon: '🌴',
    imageUrl: '/southeastasia.webp',
    budget: '$',
    budgetLabel: 'Affordable',
    timezone: '+5h to +6h',
    vibe: 'Relaxed & Creative',
    overview: 'Southeast Asia is the undisputed capital of the digital nomad world. With established hubs like Chiang Mai, Bali, and Da Nang, you will find high-speed internet and a supportive community.',
    featuredCities: [],
    enabled: true,
    order: 1,
  },
  {
    region: 'europe' as const,
    name: 'Europe',
    tagline: 'Historic cities meeting modern life.',
    icon: '☕',
    imageUrl: '/europe.webp',
    budget: '$$$',
    budgetLabel: 'Premium',
    timezone: '+1h to +2h',
    vibe: 'Sophisticated',
    overview: 'Europe offers a blend of deep history, modern convenience, and incredible diversity. Excellent train networks make weekend trips easy.',
    featuredCities: [],
    enabled: true,
    order: 2,
  },
];

async function seedRouteCards() {
  console.log('🌱 Starting Route Cards seed...\n');

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  // Check existing route cards
  const existingCards = await getRouteCards().catch(() => []);
  const existingKeys = new Set(existingCards.map(c => `${c.region}-${c.name}`));

  for (const card of ROUTE_CARDS) {
    const key = `${card.region}-${card.name}`;
    
    if (existingKeys.has(key)) {
      console.log(`  ⏭️  Skipping ${card.name} (already exists)`);
      totalSkipped++;
      continue;
    }

    try {
      await createRouteCard(card);
      console.log(`  ✅ Created ${card.name} (${card.region})`);
      totalCreated++;
    } catch (error: any) {
      console.error(`  ❌ Error creating ${card.name}:`, error.message);
      totalErrors++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Created: ${totalCreated}`);
  console.log(`  ⏭️  Skipped: ${totalSkipped}`);
  console.log(`  ❌ Errors: ${totalErrors}`);
  console.log('\n✨ Seed complete!');
}

// Run the seed
seedRouteCards().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
