/**
 * API utility functions for calling Azure Functions
 */

/**
 * Get the base URL for API calls
 * Uses NEXT_PUBLIC_FUNCTIONS_URL environment variable if set, otherwise detects runtime
 */
export function getApiUrl(): string {
  // Check for environment variable first (highest priority)
  // Note: NEXT_PUBLIC_* vars are embedded at build time in Next.js
  // They're available in both server and client code
  if (process.env.NEXT_PUBLIC_FUNCTIONS_URL) {
    const functionsUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL.trim();
    // If it's set to '/api', use local API routes
    if (functionsUrl === '/api' || functionsUrl.startsWith('/')) {
      console.log('[API] Using local /api from env var');
      return '/api';
    }
    // Otherwise use the provided Functions URL
    console.log('[API] Using Functions URL from env var:', functionsUrl);
    return functionsUrl;
  }

  // Runtime detection - check if we're on the Azure Web App
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('[API] Hostname:', hostname);
    
    // If on Azure Web App, use the Functions URL
    // Default Functions app name is southbound-functions
    if (hostname.includes('azurewebsites.net')) {
      // Try to infer Functions URL from Web App name
      // If Web App is southbound-app, Functions should be southbound-functions
      const appName = hostname.split('.')[0];
      let functionsUrl: string;
      
      if (appName.includes('-app')) {
        functionsUrl = `https://${appName.replace('-app', '-functions')}.azurewebsites.net`;
      } else {
        // Fallback: assume Functions app follows naming convention
        functionsUrl = 'https://southbound-functions.azurewebsites.net';
      }
      
      console.log('[API] Using inferred Functions URL:', functionsUrl);
      return functionsUrl;
    }
  }
  
  // Fallback for local development
  console.log('[API] Using local /api');
  return '/api';
}

/**
 * Build a full API endpoint URL
 * Uses Azure Functions when NEXT_PUBLIC_FUNCTIONS_URL is set, otherwise falls back to local /api routes
 */
export function apiUrl(path: string): string {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get the base API URL (checks NEXT_PUBLIC_FUNCTIONS_URL first)
  const baseUrl = getApiUrl();
  
  // If we have an external API URL (not starting with /), use it
  if (!baseUrl.startsWith('/')) {
    // External URL (Azure Functions)
    const finalUrl = `${baseUrl}/api/${cleanPath}`;
    console.log('[apiUrl] Using external API URL:', finalUrl);
    return finalUrl;
  }
  
  // Otherwise use local /api routes (for development or when no external URL is set)
  const finalUrl = `/api/${cleanPath}`;
  console.log('[apiUrl] Using local Next.js API route:', finalUrl);
  return finalUrl;
}

