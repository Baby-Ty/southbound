/**
 * App configuration
 * This file captures environment variables at BUILD time
 */

// The Functions URL is captured at build time
// In production, this will be the Azure Functions URL
// In development, it falls back to /api for local dev
export const FUNCTIONS_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL || '/api';

// Log the config at build/runtime for debugging
if (typeof window !== 'undefined') {
  console.log('[Config] FUNCTIONS_URL:', FUNCTIONS_URL);
}

