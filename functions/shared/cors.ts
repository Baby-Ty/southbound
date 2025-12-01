/**
 * CORS headers for Azure Functions
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function createCorsResponse(data: any, status: number = 200) {
  return {
    status,
    headers: corsHeaders,
    body: JSON.stringify(data),
  };
}


