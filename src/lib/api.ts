/**
 * API utility functions for calling Azure Functions
 */

import { FUNCTIONS_URL } from './config';

/**
 * Get the base URL for API calls
 * Uses FUNCTIONS_URL from config (captured at build time)
 */
export function getApiUrl(): string {
  return FUNCTIONS_URL;
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

