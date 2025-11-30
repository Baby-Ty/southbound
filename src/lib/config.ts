/**
 * App configuration
 * This file captures environment variables at BUILD time
 */

// Determine if we're in production (Azure) or development
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname.includes('azurewebsites.net');

// The Functions URL - use Azure Functions in production, /api locally
export const FUNCTIONS_URL = isProduction 
  ? 'https://southbound-functions.azurewebsites.net'
  : (process.env.NEXT_PUBLIC_FUNCTIONS_URL || '/api');

// Log the config at runtime for debugging
if (typeof window !== 'undefined') {
  console.log('[Config] isProduction:', isProduction);
  console.log('[Config] FUNCTIONS_URL:', FUNCTIONS_URL);
}

