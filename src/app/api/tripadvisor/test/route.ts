import { NextRequest, NextResponse } from 'next/server';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

// Note: API routes are not available in static export builds (output: 'export')
// This route will be skipped during static export

/**
 * GET /api/tripadvisor/test
 * Test endpoint to check TripAdvisor API key configuration
 */
export async function GET(request: NextRequest) {
  const apiKey = process.env.TRIPADVISOR_API_KEY;
  
  return NextResponse.json({
    apiKeyConfigured: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    staticExportDisabled: process.env.DISABLE_STATIC_EXPORT === 'true',
    message: apiKey 
      ? 'TripAdvisor API key is configured' 
      : 'TripAdvisor API key is NOT configured. Add TRIPADVISOR_API_KEY to .env.local',
  });
}

