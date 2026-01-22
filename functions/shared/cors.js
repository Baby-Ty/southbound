"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsHeaders = void 0;
exports.getCorsHeaders = getCorsHeaders;
exports.createCorsResponse = createCorsResponse;
/**
 * CORS headers for Azure Functions
 */
const allowedOrigins = [
    'https://southbnd.co.za',
    'https://hub.southbnd.co.za',
    'http://localhost:3000',
    'http://localhost:3001',
];
function getCorsHeaders(origin) {
    // If origin is provided and in allowed list, use it
    if (origin && allowedOrigins.includes(origin)) {
        return {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        };
    }
    // Default: allow all origins (for backward compatibility and development)
    // In production, consider restricting this further
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}
// Legacy export for backward compatibility
// Uses '*' to allow all origins - functions should use getCorsHeaders() with origin for better security
exports.corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};
function createCorsResponse(data, status = 200, origin) {
    return {
        status,
        headers: getCorsHeaders(origin),
        body: JSON.stringify(data),
    };
}
