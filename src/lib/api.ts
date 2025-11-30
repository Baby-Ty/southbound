/**
 * API utility functions for calling Azure Functions
 */

// Azure Functions URL for production
const AZURE_FUNCTIONS_URL = 'https://southbound-functions.azurewebsites.net';

/**
 * Get the base URL for API calls
 * Runtime detection: if on Azure Web App, use Azure Functions URL
 */
export function getApiUrl(): string {
  // Runtime detection - check if we're on the Azure Web App
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('[API] Hostname:', hostname);
    
    // If on Azure Web App, use the Functions URL
    if (hostname.includes('azurewebsites.net') || hostname.includes('southbound')) {
      console.log('[API] Using Azure Functions URL:', AZURE_FUNCTIONS_URL);
      return AZURE_FUNCTIONS_URL;
    }
  }
  
  // Fallback for local development
  console.log('[API] Using local /api');
  return '/api';
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

