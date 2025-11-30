/**
 * API utility functions for calling Azure Functions
 */

/**
 * Get the base URL for API calls
 * Uses NEXT_PUBLIC_FUNCTIONS_URL if set, otherwise falls back to /api for local development
 */
export function getApiUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default to /api
    return process.env.NEXT_PUBLIC_FUNCTIONS_URL || '/api';
  }
  
  // Client-side: use environment variable or default to /api
  return process.env.NEXT_PUBLIC_FUNCTIONS_URL || '/api';
}

/**
 * Build a full API endpoint URL
 */
export function apiUrl(path: string): string {
  const baseUrl = getApiUrl();
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If baseUrl ends with /api, don't add another /api
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}/${cleanPath}`;
  }
  
  // Otherwise, add /api prefix
  return `${baseUrl}/api/${cleanPath}`;
}

