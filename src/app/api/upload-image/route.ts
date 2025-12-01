import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API route for uploading images to Azure Blob Storage
 * Proxies to Azure Functions upload-image endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, imageData, category, filename } = body;

    if (!imageUrl && !imageData) {
      return NextResponse.json(
        { error: 'Either imageUrl or imageData is required' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const validCategories = ['cities', 'highlights', 'activities', 'accommodations'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Call Azure Functions upload-image endpoint
    const functionsUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'https://southbound-functions.azurewebsites.net';
    const uploadUrl = `${functionsUrl}/api/upload-image`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        imageData,
        category,
        filename,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to upload image' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API /api/upload-image] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
