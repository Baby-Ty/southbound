import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { uploadImageFromUrl, uploadImageFromBase64 } from '../shared/azureBlob';
import { compressToWebP } from '../shared/imageCompression';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function uploadImage(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  try {
    const body = req.body as {
      imageUrl?: string;
      imageData?: string;
      category?: string;
      filename?: string;
    };
    const { imageUrl, imageData, category, filename } = body;

    if (!imageUrl && !imageData) {
      (context as any).res = createCorsResponse(
        { error: 'Either imageUrl or imageData is required' },
        400
      ); return;
    }

    if (!category) {
      (context as any).res = createCorsResponse(
        { error: 'Category is required' },
        400
      ); return;
    }

    const validCategories = ['cities', 'highlights', 'activities', 'accommodations'];
    if (!validCategories.includes(category)) {
      (context as any).res = createCorsResponse(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        400
      ); return;
    }

    let blobUrl: string;

    if (imageData) {
      blobUrl = await uploadImageFromBase64(
        imageData,
        category as 'cities' | 'highlights' | 'activities' | 'accommodations',
        filename
      );
    } else if (imageUrl) {
      blobUrl = await uploadImageFromUrl(
        imageUrl,
        category as 'cities' | 'highlights' | 'activities' | 'accommodations',
        filename
      );
    } else {
      (context as any).res = createCorsResponse(
        { error: 'Either imageUrl or imageData is required' },
        400
      ); return;
    }

    (context as any).res = createCorsResponse({
      success: true,
      blobUrl,
      message: 'Image uploaded successfully',
    }); return;
  } catch (error: any) {
      context.log(`Error uploading image: ${error instanceof Error ? error.message : String(error)}`);
    
    (context as any).res = createCorsResponse(
      { 
        error: error.message || 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    ); return;
  }
}

module.exports = { uploadImage };
