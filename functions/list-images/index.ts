import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { BlobServiceClient } from '@azure/storage-blob';
import { corsHeaders, createCorsResponse } from '../shared/cors';

function getBlobServiceClient(): BlobServiceClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}

export interface ImageInfo {
  url: string;
  filename: string;
  size: number;
  format: string;
  uploadDate?: Date;
  category: string;
  isCompressed: boolean;
  container: string;
}

export async function listImages(context: InvocationContext, request: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  try {
    // Get query parameters from request.query object (Azure Functions with function.json)
    const category = (request.query as any).category as string | null; // Optional filter
    const page = parseInt((request.query as any).page || '1', 10);
    const pageSize = parseInt((request.query as any).pageSize || '50', 10);

    const blobServiceClient = getBlobServiceClient();
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'southbound-images';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Check if container exists
    const exists = await containerClient.exists();
    if (!exists) {
      return createCorsResponse({
        images: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      });
    }

    const images: ImageInfo[] = [];
    const categories = category 
      ? [category] 
      : ['cities', 'highlights', 'activities', 'accommodations'];

    // List blobs in each category
    for (const cat of categories) {
      const prefix = `${cat}/`;
      
      for await (const blob of containerClient.listBlobsFlat({ prefix })) {
        // Skip if not an image
        const extension = blob.name.toLowerCase().split('.').pop();
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
          continue;
        }

        const blobClient = containerClient.getBlobClient(blob.name);
        const isCompressed = extension === 'webp' || blob.name.toLowerCase().endsWith('.webp');
        
        images.push({
          url: blobClient.url,
          filename: blob.name.split('/').pop() || blob.name,
          size: blob.properties.contentLength || 0,
          format: extension || 'unknown',
          uploadDate: blob.properties.createdOn,
          category: cat,
          isCompressed,
          container: containerName,
        });
      }
    }

    // Sort by upload date (newest first)
    images.sort((a, b) => {
      const dateA = a.uploadDate?.getTime() || 0;
      const dateB = b.uploadDate?.getTime() || 0;
      return dateB - dateA;
    });

    // Calculate pagination
    const total = images.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedImages = images.slice(startIndex, endIndex);

    // Calculate statistics
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    const compressedCount = images.filter(img => img.isCompressed).length;
    const uncompressedSize = images
      .filter(img => !img.isCompressed)
      .reduce((sum, img) => sum + img.size, 0);

    return createCorsResponse({
      images: paginatedImages,
      total,
      page,
      pageSize,
      totalPages,
      stats: {
        totalImages: total,
        totalSize,
        compressedCount,
        uncompressedCount: total - compressedCount,
        uncompressedSize,
        averageSize: total > 0 ? Math.round(totalSize / total) : 0,
      },
    });
  } catch (error: any) {
    context.log(`Error listing images: ${error instanceof Error ? error.message : String(error)}`);
    
    return createCorsResponse(
      { 
        error: error.message || 'Failed to list images',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  }
}

module.exports = { listImages };