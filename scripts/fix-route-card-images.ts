import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local FIRST
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { updateRouteCard } from '../functions/shared/cosmos';

async function fixRouteCardImages() {
  console.log('🔄 Updating route card image URLs to WebP...\n');

  const updates = [
    { id: 'ABfhif3zmF17ru2lkvqPy', region: 'latin-america', imageUrl: '/SouthAmerica.webp' },
    { id: '0u-OSNzPyB33NsxhggtfT', region: 'southeast-asia', imageUrl: '/southeastasia.webp' },
    { id: 'JMNNE1cknc0jO1duOELYf', region: 'europe', imageUrl: '/europe.webp' },
  ];

  for (const { id, region, imageUrl } of updates) {
    try {
      console.log(`📝 Updating ${region}: ${imageUrl}`);
      await updateRouteCard(id, region, { imageUrl });
      console.log(`✅ Updated ${region}\n`);
    } catch (error: any) {
      console.error(`❌ Error updating ${region}:`, error.message);
    }
  }

  console.log('✨ All route card images updated to WebP!');
  console.log('🌐 Refresh https://southbnd.co.za/discover/ to see the changes.');
}

fixRouteCardImages().catch(console.error);
