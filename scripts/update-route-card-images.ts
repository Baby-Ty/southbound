import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const endpoint = process.env.COSMOSDB_ENDPOINT!;
const key = process.env.COSMOSDB_KEY!;
const databaseName = process.env.COSMOSDB_DATABASE_NAME || 'southbnd';
const containerName = 'routeCards';

async function updateRouteCardImages() {
  console.log('🔄 Updating route card image URLs to WebP...\n');

  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseName);
  const container = database.container(containerName);

  // Query all route cards
  const { resources: routeCards } = await container.items
    .query('SELECT * FROM c')
    .fetchAll();

  console.log(`Found ${routeCards.length} route cards\n`);

  const updates = [
    { region: 'latin-america', oldUrl: '/SouthAmerica.png', newUrl: '/SouthAmerica.webp' },
    { region: 'southeast-asia', oldUrl: '/southeastasia.png', newUrl: '/southeastasia.webp' },
    { region: 'europe', oldUrl: '/europe.png', newUrl: '/europe.webp' },
  ];

  for (const update of updates) {
    try {
      // Find the route card by region
      const routeCard = routeCards.find(rc => rc.region === update.region);
      
      if (!routeCard) {
        console.error(`❌ Route card not found: ${update.region}`);
        continue;
      }

      console.log(`📝 ${routeCard.name}: ${routeCard.imageUrl} → ${update.newUrl}`);

      // Update the imageUrl
      routeCard.imageUrl = update.newUrl;
      routeCard.updatedAt = new Date().toISOString();

      // Replace the document (using id and region as partition key)
      await container.item(routeCard.id, routeCard.region).replace(routeCard);
      
      console.log(`✅ Updated ${routeCard.name}\n`);
    } catch (error: any) {
      console.error(`❌ Error updating ${update.region}:`, error.message);
    }
  }

  console.log('✨ All route card images updated to WebP!');
  console.log('🌐 Refresh https://southbnd.co.za/discover/ to see the changes.');
}

updateRouteCardImages().catch(console.error);
