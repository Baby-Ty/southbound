import { NextRequest, NextResponse } from 'next/server';
import { getLead, updateLead, deleteLead } from '@/lib/cosmos';
import { Lead } from '@/lib/cosmos';

/**
 * Next.js API route for individual leads
 * GET: Get a single lead by ID
 * PATCH: Update a lead
 * DELETE: Delete a lead
 */

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await context.params;

    console.log('[API /api/leads/[id]] Fetching lead', leadId);
    console.log('[API /api/leads/[id]] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/leads/[id]] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    const lead = await getLead(leadId);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    console.log('[API /api/leads/[id]] Success: Returning lead', leadId);
    
    return NextResponse.json({ lead });
  } catch (error: any) {
    console.error('[API /api/leads/[id]] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await context.params;
    const body = await request.json();

    console.log('[API /api/leads/[id]] Updating lead', leadId, body);
    console.log('[API /api/leads/[id]] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/leads/[id]] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    // Only allow updating specific fields
    const allowedUpdates: Partial<Lead> = {};
    if (body.name !== undefined) allowedUpdates.name = body.name.trim();
    if (body.destination !== undefined) allowedUpdates.destination = body.destination.trim();
    if (body.stage !== undefined) allowedUpdates.stage = body.stage;
    if (body.notes !== undefined) allowedUpdates.notes = body.notes;
    if (body.lastContact !== undefined) allowedUpdates.lastContact = body.lastContact;

    const lead = await updateLead(leadId, allowedUpdates);
    
    console.log('[API /api/leads/[id]] Success: Updated lead', leadId);
    
    return NextResponse.json({ lead });
  } catch (error: any) {
    console.error('[API /api/leads/[id]] Error:', error);
    
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await context.params;

    console.log('[API /api/leads/[id]] Deleting lead', leadId);
    console.log('[API /api/leads/[id]] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/leads/[id]] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    await deleteLead(leadId);
    
    console.log('[API /api/leads/[id]] Success: Deleted lead', leadId);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /api/leads/[id]] Error:', error);
    
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

