import { NextRequest, NextResponse } from 'next/server';
import { getTripTemplates } from '@/../../functions/shared/cosmos';

// Mark as dynamic to exclude from static export
export const dynamic = 'force-dynamic';

/**
 * GET /api/trip-templates
 * 
 * Fetch trip templates from CosmosDB
 * Supports filters: region, enabled, curated (isCurated)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const regionParam = searchParams.get('region');
    const enabledParam = searchParams.get('enabled');
    const curatedParam = searchParams.get('curated');
    
    const validRegions = ['europe', 'latin-america', 'southeast-asia'];
    const region = regionParam && validRegions.includes(regionParam)
      ? (regionParam as 'europe' | 'latin-america' | 'southeast-asia')
      : undefined;
    
    const enabled =
      enabledParam === null || enabledParam === undefined
        ? undefined
        : enabledParam === 'true'
          ? true
          : false;

    const isCurated =
      curatedParam === null || curatedParam === undefined
        ? undefined
        : curatedParam === 'true'
          ? true
          : false;

    const templates = await getTripTemplates({
      ...(region ? { region } : {}),
      ...(typeof enabled === 'boolean' ? { enabled } : {}),
      ...(typeof isCurated === 'boolean' ? { isCurated } : {}),
    });
    
    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error('[API /trip-templates] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trip templates', templates: [] },
      { status: 500 }
    );
  }
}
