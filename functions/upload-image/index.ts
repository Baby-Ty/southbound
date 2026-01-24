import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { uploadImageFromUrl, uploadImageFromBase64 } from '../shared/azureBlob';
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
    context.log('[upload-image] Processing upload request');
    const body = req.body as {
      imageUrl?: string;
      imageData?: string;
      category?: string;
      filename?: string;
    };
    const { imageUrl, imageData, category, filename } = body;
    context.log(`[upload-image] Category: ${category}, hasImageUrl: ${!!imageUrl}, hasImageData: ${!!imageData}`);

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

    const validCategories = ['cities', 'highlights', 'activities', 'accommodations', 'route-cards', 'trip-templates', 'countries'];
    if (!validCategories.includes(category)) {
      (context as any).res = createCorsResponse(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        400
      ); return;
    }

    let blobUrl: string;

    try {
      if (imageData) {
        context.log('[upload-image] Uploading from base64 data');
        blobUrl = await uploadImageFromBase64(
          imageData,
          category,
          filename
        );
      } else if (imageUrl) {
        context.log('[upload-image] Uploading from URL');
        blobUrl = await uploadImageFromUrl(
          imageUrl,
          category,
          filename
        );
      } else {
        (context as any).res = createCorsResponse(
          { error: 'Either imageUrl or imageData is required' },
          400
        ); return;
      }
      context.log(`[upload-image] Successfully uploaded to: ${blobUrl}`);
    } catch (uploadError: any) {
      context.log(`[upload-image] Upload error: ${uploadError.message}`);
      context.log(`[upload-image] Stack: ${uploadError.stack}`);
      throw uploadError;
    }

    (context as any).res = createCorsResponse({
      success: true,
      blobUrl,
      message: 'Image uploaded successfully',
    }); return;
  } catch (error: any) {
    context.log(`[upload-image] Error uploading image: ${error instanceof Error ? error.message : String(error)}`);
    context.log(`[upload-image] Error stack: ${error.stack}`);
    
    (context as any).res = createCorsResponse(
      { 
        error: error.message || 'Failed to upload image',
        details: error.stack
      },
      500
    ); return;
  }
}

module.exports = { uploadImage };
