/**
 * API utility functions for calling Azure Functions
 */

/**
 * Get the base URL for API calls
 * Uses NEXT_PUBLIC_FUNCTIONS_URL environment variable if set, otherwise detects runtime
 * For local development, prefers local API routes when on localhost
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

  // Runtime detection - check if we're on the Azure Web App or custom domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('[API] Hostname:', hostname);
    
    // If on Azure Web App or custom domain, use the Functions URL
    // Check for custom domain first (southbnd.co.za or hub.southbnd.co.za)
    if (hostname.includes('southbnd.co.za')) {
      // Use direct Azure Functions URL (has valid SSL cert)
      // Note: api.southbnd.co.za requires SSL certificate configuration in Azure
      const functionsUrl = 'https://southbnd-functions-v4.azurewebsites.net';
      console.log('[API] Using Functions URL:', functionsUrl);
      return functionsUrl;
    }
    
    // Fallback: check if on Azure Web App (azurewebsites.net)
    if (hostname.includes('azurewebsites.net')) {
      // Use the actual Functions URL
      const functionsUrl = 'https://southbnd-functions-v4.azurewebsites.net';
      console.log('[API] Using Functions URL:', functionsUrl);
      return functionsUrl;
    }
  }
  
  // Fallback for local development
  console.log('[API] Using local /api');
  return '/api';
}

/**
 * Build a full API endpoint URL
 * Routes intelligently:
 * - TripAdvisor and activities endpoints -> Local Next.js API routes (when on localhost)
 * - Cities endpoints (base CRUD) -> Azure Functions
 * - Other endpoints -> Azure Functions (or local if configured)
 */
export function apiUrl(path: string): string {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Routes that should use local Next.js API
  const isTripAdvisorRoute = cleanPath.startsWith('tripadvisor/');
  const isCityActivitiesRoute = cleanPath.includes('/activities');
  const isAttractionsRoute = cleanPath.startsWith('attractions/');
  const isCityDescriptionRoute = cleanPath === 'cities/description';
  const isCountriesRoute = cleanPath.startsWith('countries');
  const isTripTemplatesRoute = cleanPath.startsWith('trip-templates');
  const isRoutesRoute = cleanPath.startsWith('routes');
  const isCitiesRoute = cleanPath.startsWith('cities');
  const isDefaultTripsRoute = cleanPath.startsWith('default-trips');
  
  // Check if we're on localhost (for local development)
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Check if static export is disabled (required for API routes)
  const staticExportDisabled = process.env.DISABLE_STATIC_EXPORT === 'true';
  
  // For TripAdvisor, activities, attractions, and city description routes, use local API when on localhost
  // (These routes exist locally when DISABLE_STATIC_EXPORT=true)
  if ((isTripAdvisorRoute || isCityActivitiesRoute || isAttractionsRoute || isCityDescriptionRoute) && isLocalhost) {
    const finalUrl = `/api/${cleanPath}`;
    console.log('[apiUrl] Using local Next.js API route (Localhost):', finalUrl);
    return finalUrl;
  }
  
  // These routes use local Next.js API only on localhost (for development)
  // In production, they go to Azure Functions
  if ((isCountriesRoute || isTripTemplatesRoute || isRoutesRoute || isCitiesRoute || isDefaultTripsRoute) && isLocalhost) {
    const finalUrl = `/api/${cleanPath}`;
    console.log('[apiUrl] Using local Next.js API route:', finalUrl);
    return finalUrl;
  }
  
  // For all other routes (including base cities endpoints), use Azure Functions
  const baseUrl = getApiUrl();
  
  // If we have an external API URL (not starting with /), use it
  if (!baseUrl.startsWith('/')) {
    // External URL (Azure Functions)
    const finalUrl = `${baseUrl}/api/${cleanPath}`;
    console.log('[apiUrl] Using external API URL (Azure Functions):', finalUrl);
    return finalUrl;
  }
  
  // Fallback: if no Functions URL is configured, try local routes
  // (This should only happen in development without Azure Functions configured)
  const finalUrl = `/api/${cleanPath}`;
  console.log('[apiUrl] Using local Next.js API route (fallback):', finalUrl);
  return finalUrl;
}

