import { config } from 'dotenv';
import { resolve } from 'path';

const result = config({ path: resolve(process.cwd(), '.env.local') });

console.log('Dotenv result:', result);
console.log('ENDPOINT:', process.env.COSMOSDB_ENDPOINT ? 'SET (' + process.env.COSMOSDB_ENDPOINT.substring(0, 30) + '...)' : 'NOT SET');
console.log('KEY:', process.env.COSMOSDB_KEY ? 'SET (' + process.env.COSMOSDB_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('DATABASE:', process.env.COSMOSDB_DATABASE_ID || 'NOT SET');

