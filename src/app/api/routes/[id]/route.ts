import { NextRequest, NextResponse } from 'next/server';
import { getRoute, updateRoute, deleteRoute } from '@/lib/cosmos';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    const route = await getRoute(id);
    
    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ route });
  } catch (error: any) {
    console.error('[API /routes/[id]] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch route' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    const route = await updateRoute(id, body);
    return NextResponse.json({ route });
  } catch (error: any) {
    console.error('[API /routes/[id]] Error updating route:', error);
    
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update route' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    await deleteRoute(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /routes/[id]] Error deleting route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete route' },
      { status: 500 }
    );
  }
}
