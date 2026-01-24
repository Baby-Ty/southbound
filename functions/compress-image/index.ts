import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { BlobServiceClient } from '@azure/storage-blob';
import { compressToWebP } from '../shared/imageCompression';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function getBlobServiceClient(): BlobServiceClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}

/**
 * Extract blob name and container from blob URL
 * Handles format: https://{account}.blob.core.windows.net/{container}/{blob-path}
 */
function parseBlobUrl(blobUrl: string): { containerName: string; blobName: string } | null {
  try {
    const url = new URL(blobUrl);
    
    // Verify it's a blob storage URL
    if (!url.hostname.includes('.blob.core.windows.net')) {
      return null;
    }
    
    const pathParts = url.pathname.split('/').filter(p => p);
    
    if (pathParts.length < 2) {
      return null;
    }
    
    const containerName = pathParts[0];
    const blobName = pathParts.slice(1).join('/');
    
    return { containerName, blobName };
  } catch {
    return null;
  }
}

export async function compressImage(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    const body = (typeof req.body === 'object' && req.body !== null && !(req.body instanceof ReadableStream) 
      ? req.body 
      : {}) as {
      blobUrl: string;
      quality?: number;
      replaceOriginal?: boolean;
    };

    const { blobUrl, quality = 80, replaceOriginal = true } = body;

    if (!blobUrl) {
      return createCorsResponse(
        { error: 'blobUrl is required' },
        400
      );
    }

    // Parse blob URL to get container and blob name
    const parsed = parseBlobUrl(blobUrl);
    if (!parsed) {
      return createCorsResponse(
        { error: 'Invalid blob URL format' },
        400
      );
    }

    const { containerName, blobName } = parsed;
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Check if blob exists
    const exists = await blobClient.exists();
    if (!exists) {
      return createCorsResponse(
        { error: 'Blob not found' },
        404
      );
    }

    // Download the image
    const downloadResponse = await blobClient.download();
    const chunks: Buffer[] = [];
    
    if (!downloadResponse.readableStreamBody) {
      throw new Error('Failed to download blob');
    }

    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(Buffer.from(chunk));
    }

    const imageBuffer = Buffer.concat(chunks);
    const originalSize = imageBuffer.length;

    // Check if already WebP
    const isWebP = blobName.toLowerCase().endsWith('.webp');
    if (isWebP) {
      return createCorsResponse({
        success: true,
        message: 'Image is already in WebP format',
        blobUrl,
        originalSize,
        compressedSize: originalSize,
        reductionPercent: 0,
        alreadyCompressed: true,
      });
    }

    // Compress the image
    const compressionResult = await compressToWebP(imageBuffer, { quality });

    // Determine new blob name
    const newBlobName = replaceOriginal
      ? blobName.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp')
      : blobName.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp').replace(/(\.[^.]+)$/, '-compressed$1');

    // Upload compressed version
    const newBlockBlobClient = containerClient.getBlockBlobClient(newBlobName);
    await newBlockBlobClient.upload(compressionResult.buffer, compressionResult.buffer.length, {
      blobHTTPHeaders: {
        blobContentType: 'image/webp',
      },
    });

    const newBlobUrl = newBlockBlobClient.url;

    // If replacing original, delete the old blob
    if (replaceOriginal && newBlobName !== blobName) {
      try {
        await blobClient.delete();
      } catch (deleteError: any) {
        context.log(`Warning: Failed to delete original blob: ${deleteError.message}`);
        // Continue anyway - we've uploaded the compressed version
      }
    }

    return createCorsResponse({
      success: true,
      message: 'Image compressed successfully',
      blobUrl: newBlobUrl,
      originalBlobUrl: replaceOriginal ? newBlobUrl : blobUrl,
      originalSize: compressionResult.originalSize,
      compressedSize: compressionResult.compressedSize,
      reductionPercent: compressionResult.reductionPercent,
      format: compressionResult.format,
    });
  } catch (error: any) {
    context.log(`Error compressing image: ${error instanceof Error ? error.message : String(error)}`);
    
    return createCorsResponse(
      { 
        error: error.message || 'Failed to compress image',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  }
}

module.exports = { compressImage };