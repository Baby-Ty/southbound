import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working',
    env: {
      endpoint: process.env.COSMOSDB_ENDPOINT ? 'SET' : 'NOT SET',
      key: process.env.COSMOSDB_KEY ? 'SET' : 'NOT SET',
      database: process.env.COSMOSDB_DATABASE_ID || 'NOT SET',
    }
  });
}

