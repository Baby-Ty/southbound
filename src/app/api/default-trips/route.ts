import { NextRequest, NextResponse } from 'next/server';
import type { RegionKey } from '@/lib/cityPresets';
import {
  createDefaultTrip,
  getDefaultTrips,
  type DefaultTrip,
} from '@/lib/cosmos-default-trips';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region') as RegionKey | null;
    const enabledParam = searchParams.get('enabled');
    const enabled =
      enabledParam === null ? undefined : enabledParam === 'true' ? true : false;

    const trips = await getDefaultTrips({
      ...(region ? { region } : {}),
      ...(typeof enabled === 'boolean' ? { enabled } : {}),
    });

    return NextResponse.json({ trips });
  } catch (error: any) {
    console.error('[API /default-trips] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch default trips' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<
      DefaultTrip,
      'id' | 'createdAt' | 'updatedAt'
    >;

    if (!body?.name || !body?.region || !Array.isArray(body?.stops)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, region, stops' },
        { status: 400 }
      );
    }

    const trip = await createDefaultTrip({
      name: body.name,
      region: body.region,
      enabled: body.enabled ?? true,
      order: Number.isFinite(body.order) ? body.order : 0,
      stops: body.stops,
      notes: body.notes,
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error: any) {
    console.error('[API /default-trips] Error creating default trip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create default trip' },
      { status: 500 }
    );
  }
}

