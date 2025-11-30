import { NextRequest, NextResponse } from 'next/server';
import { uploadImageFromUrl, uploadImageFromBase64 } from '@/lib/azureBlob';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

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

    // Validate category
    const validCategories = ['cities', 'highlights', 'activities', 'accommodations'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    let blobUrl: string;

    // Handle base64 data (file upload)
    if (imageData) {
      blobUrl = await uploadImageFromBase64(
        imageData,
        category as 'cities' | 'highlights' | 'activities' | 'accommodations',
        filename
      );
    } else if (imageUrl) {
      // Handle URL (existing functionality)
      blobUrl = await uploadImageFromUrl(
        imageUrl,
        category as 'cities' | 'highlights' | 'activities' | 'accommodations',
        filename
      );
    } else {
      return NextResponse.json(
        { error: 'Either imageUrl or imageData is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        blobUrl,
        message: 'Image uploaded successfully',
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

