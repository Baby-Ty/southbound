import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, saveLead } from '@/lib/cosmos';
import { Lead } from '@/lib/cosmos';

/**
 * Next.js API route for leads
 * GET: List all leads (with optional filters)
 * POST: Create a new lead
 */

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stage = searchParams.get('stage') as Lead['stage'] | null;
    const destination = searchParams.get('destination');

    console.log('[API /api/leads] Fetching leads', { stage, destination });
    console.log('[API /api/leads] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/leads] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    const filters: {
      stage?: Lead['stage'];
      destination?: string;
    } = {};

    if (stage) filters.stage = stage;
    if (destination) filters.destination = destination;

    const leads = await getAllLeads(filters);
    
    console.log('[API /api/leads] Success: Returning', leads.length, 'leads');
    
    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error('[API /api/leads] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, destination, stage, notes } = body;

    // Validate required fields
    if (!name || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: name and destination are required' },
        { status: 400 }
      );
    }

    console.log('[API /api/leads] Creating lead', { name, destination, stage });
    console.log('[API /api/leads] CosmosDB endpoint:', process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET');
    console.log('[API /api/leads] CosmosDB key:', process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET');

    const leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      destination: destination.trim(),
      stage: (stage || 'New') as Lead['stage'],
      notes: notes || '',
      lastContact: new Date().toISOString().split('T')[0],
    };

    const lead = await saveLead(leadData);
    
    console.log('[API /api/leads] Success: Created lead', lead.id);
    
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error: any) {
    console.error('[API /api/leads] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save lead' },
      { status: 500 }
    );
  }
}

