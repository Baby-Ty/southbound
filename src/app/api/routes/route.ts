import { NextRequest, NextResponse } from 'next/server';
import { getAllRoutes, saveRoute, SavedRoute } from '@/lib/cosmos';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as SavedRoute['status'] | null;
    const email = searchParams.get('email');
    const region = searchParams.get('region');

    const filters = {
      ...(status && { status }),
      ...(email && { email }),
      ...(region && { region }),
    };

    const routes = await getAllRoutes(filters);
    return NextResponse.json({ routes });
  } catch (error: any) {
    console.error('[API /routes] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, region, stops, preferences, notes } = body;

    if (!name || !email || !region || !stops || !preferences) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, region, stops, preferences' },
        { status: 400 }
      );
    }

    if (!name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Allow WhatsApp format emails (e.g., +27821234567@whatsapp)
    const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const route = await saveRoute({
      name: name.trim(),
      email,
      region,
      stops,
      preferences,
      status: 'draft',
      notes: notes || '',
    });

    return NextResponse.json({ route }, { status: 201 });
  } catch (error: any) {
    console.error('[API /routes] Error creating route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create route' },
      { status: 500 }
    );
  }
}
