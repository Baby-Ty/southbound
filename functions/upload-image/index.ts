import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { uploadImageFromUrl, uploadImageFromBase64 } from '../shared/azureBlob';
import { corsHeaders, createCorsResponse } from '../shared/cors';

export async function uploadImage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    const body = await request.json();
    const { imageUrl, imageData, category, filename } = body;

    if (!imageUrl && !imageData) {
      return createCorsResponse(
        { error: 'Either imageUrl or imageData is required' },
        400
      );
    }

    if (!category) {
      return createCorsResponse(
        { error: 'Category is required' },
        400
      );
    }

    const validCategories = ['cities', 'highlights', 'activities', 'accommodations'];
    if (!validCategories.includes(category)) {
      return createCorsResponse(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        400
      );
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
      return createCorsResponse(
        { error: 'Either imageUrl or imageData is required' },
        400
      );
    }

    return createCorsResponse({
      success: true,
      blobUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    context.log.error('Error uploading image:', error);
    
    return createCorsResponse(
      { 
        error: error.message || 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  }
}

app.http('upload-image', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: uploadImage,
});

