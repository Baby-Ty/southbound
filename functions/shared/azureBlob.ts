import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
// Note: Sharp import removed to avoid native module loading issues in Azure Functions
// Compression is disabled by default (see uploadImageBuffer compress parameter)

let blobServiceClient: BlobServiceClient | null = null;

function getBlobServiceClient(): BlobServiceClient {
  if (blobServiceClient) {
    return blobServiceClient;
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
  }

  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  return blobServiceClient;
}

async function getContainerClient(): Promise<ContainerClient> {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'southbound-images';
  const serviceClient = getBlobServiceClient();
  const client = serviceClient.getContainerClient(containerName);
  
  try {
    await client.createIfNotExists({
      access: 'blob',
    });
  } catch (error: any) {
    if (error.statusCode !== 409) {
      throw error;
    }
  }
  
  return client;
}

export async function uploadImageFromUrl(
  imageUrl: string,
  category: string,
  filename?: string
): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return await uploadImageBuffer(buffer, category, filename);
}

export async function uploadImageBuffer(
  buffer: Buffer,
  category: string,
  filename?: string,
  compress: boolean = false
): Promise<string> {
  const container = await getContainerClient();
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const originalFilename = filename || `${category}/${timestamp}-${randomId}.png`;
  
  let blobName = originalFilename.startsWith(category + '/') 
    ? originalFilename 
    : `${category}/${originalFilename}`;

  // Compress image if requested and not already WebP
  let finalBuffer = buffer;
  let contentType = 'image/webp';
  
  if (compress) {
    // Compression is disabled - Sharp native module causes issues in Azure Functions
    // TODO: Implement compression with a pure JS library or fix Sharp configuration
    console.warn('Image compression requested but disabled due to Sharp module issues');
    const extension = blobName.toLowerCase().split('.').pop();
    if (extension === 'png') contentType = 'image/png';
    else if (extension === 'gif') contentType = 'image/gif';
    else if (extension === 'webp') contentType = 'image/webp';
    else contentType = 'image/jpeg';
  } else {
    // Determine content type from extension
    const extension = blobName.toLowerCase().split('.').pop();
    if (extension === 'png') contentType = 'image/png';
    else if (extension === 'gif') contentType = 'image/gif';
    else if (extension === 'webp') contentType = 'image/webp';
    else contentType = 'image/jpeg';
  }

  const blockBlobClient = container.getBlockBlobClient(blobName);
  
  await blockBlobClient.upload(finalBuffer, finalBuffer.length, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
  });

  return blockBlobClient.url;
}

export async function uploadImageFromBase64(
  base64Data: string,
  category: string,
  filename?: string
): Promise<string> {
  const base64String = base64Data.includes(',') 
    ? base64Data.split(',')[1] 
    : base64Data;
  
  const buffer = Buffer.from(base64String, 'base64');
  return await uploadImageBuffer(buffer, category, filename);
}

/**
 * Upload multiple activity photos from URLs
 * @param photoUrls Array of photo URLs to download and upload
 * @param cityId City ID for organizing photos
 * @param locationId TripAdvisor location ID
 * @returns Array of blob storage URLs
 */
export async function uploadActivityPhotos(
  photoUrls: string[],
  cityId: string,
  locationId: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];
  
  for (let i = 0; i < photoUrls.length; i++) {
    try {
      const photoUrl = photoUrls[i];
      const filename = `activities/${cityId}/${locationId}/${i}.jpg`;
      
      const blobUrl = await uploadImageFromUrl(photoUrl, 'activities', filename);
      uploadedUrls.push(blobUrl);
    } catch (error: any) {
      console.error(`Failed to upload activity photo ${i} for ${locationId}:`, error);
      // Continue with other photos even if one fails
      // Fallback: use original URL if blob upload fails
      uploadedUrls.push(photoUrls[i]);
    }
  }
  
  return uploadedUrls;
}





