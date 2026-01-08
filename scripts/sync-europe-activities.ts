/**
 * Script to trigger syncing TripAdvisor activities for all European cities
 * 
 * Usage:
 *   # Make sure Next.js dev server is running first:
 *   npm run dev
 *   
 *   # Then in another terminal:
 *   npx tsx scripts/sync-europe-activities.ts
 * 
 * Or with options:
 *   npx tsx scripts/sync-europe-activities.ts --limit 20 --skip-existing
 * 
 * Environment variables:
 *   PORT - Next.js server port (default: 3000)
 *   HOST - Next.js server host (default: localhost)
 */

interface SyncOptions {
  limit?: number;
  skipExisting?: boolean;
  cityId?: string;
}

async function syncActivities(options: SyncOptions = {}) {
  const { limit = 30, skipExisting = false, cityId } = options;
  
  console.log('🚀 Starting TripAdvisor activities sync for European cities...');
  console.log(`Options: limit=${limit}, skipExisting=${skipExisting}, cityId=${cityId || 'all'}`);
  console.log('');

  try {
    // Build absolute URL for the API endpoint
    const port = process.env.PORT || process.env.NEXT_PORT || '3000';
    const host = process.env.HOST || 'localhost';
    const url = `http://${host}:${port}/api/tripadvisor/sync`;
    
    console.log(`Calling: ${url}`);
    console.log('(Make sure Next.js dev server is running on this port)');
    console.log('');
    console.log('⏳ This may take a while due to rate limiting (2 seconds between API calls)...');
    console.log('💡 Check your Next.js dev server terminal for detailed progress logs');
    console.log('');
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 3600000); // 1 hour timeout (should be enough for ~50 cities)
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit,
          skipExisting,
          ...(cityId && { cityId }),
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('');
    console.log('✅ Sync completed!');
    console.log('');
    console.log('Results:');
    console.log(`  - Synced: ${result.synced?.length || 0} cities`);
    console.log(`  - Skipped: ${result.skipped?.length || 0} cities`);
    console.log(`  - Errors: ${result.errors?.length || 0} cities`);
    console.log(`  - Remaining: ${result.remainingCities || 0} cities`);
    console.log('');

    if (result.synced && result.synced.length > 0) {
      console.log('Successfully synced cities:');
      result.synced.forEach((city: any) => {
        console.log(`  ✓ ${city.cityName}: ${city.activitiesCount} activities, ${city.defaultsSet} defaults`);
      });
      console.log('');
    }

    if (result.skipped && result.skipped.length > 0) {
      console.log('Skipped cities:');
      result.skipped.forEach((city: any) => {
        console.log(`  ⊘ ${city.cityName}: ${city.reason}`);
      });
      console.log('');
    }

    if (result.errors && result.errors.length > 0) {
      console.log('Errors:');
      result.errors.forEach((error: any) => {
        console.log(`  ✗ ${error.cityName}: ${error.error}`);
      });
      console.log('');
    }

      return result;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out after 1 hour. The sync may still be running on the server - check server logs.');
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('❌ Sync failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      console.error('');
      console.error('💡 Tip: Make sure your Next.js dev server is running:');
      console.error('   npm run dev');
    }
    
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: SyncOptions = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) {
    options.limit = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--skip-existing') {
    options.skipExisting = true;
  } else if (args[i] === '--city-id' && args[i + 1]) {
    options.cityId = args[i + 1];
    i++;
  }
}

// Run the sync
syncActivities(options).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
