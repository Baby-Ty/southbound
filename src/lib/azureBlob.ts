/**
 * Azure Blob Storage client for uploading images
 */

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: ContainerClient | null = null;

/**
 * Initialize Azure Blob Storage client
 */
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

/**
 * Get container client, creating it if it doesn't exist
 */
async function getContainerClient(): Promise<ContainerClient> {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'southbound-images';
  
  // Always get a fresh container client (don't cache)
  const serviceClient = getBlobServiceClient();
  const client = serviceClient.getContainerClient(containerName);
  
  // Create container if it doesn't exist with public blob access
  // 'blob' access level allows anonymous read access to blobs (public URLs)
  try {
    const createResponse = await client.createIfNotExists({
      access: 'blob', // Public read access to blobs (anonymous users can read blobs via URL)
    });
    if (createResponse.succeeded) {
      console.log(`Container '${containerName}' created successfully`);
    } else {
      console.log(`Container '${containerName}' already exists`);
    }
  } catch (error: any) {
    console.error('Error creating container:', error);
    // If it's a 409 Conflict, container already exists - that's fine
    if (error.statusCode === 409 || error.statusCode === 404) {
      console.log(`Container '${containerName}' may not exist. Attempting to create...`);
      // Try to create it explicitly
      try {
        await client.create({
          access: 'blob', // Public read access to blobs (anonymous users can read blobs via URL)
        });
        console.log(`Container '${containerName}' created successfully with public blob access`);
      } catch (createError: any) {
        if (createError.statusCode === 409) {
          console.log(`Container '${containerName}' already exists`);
          // Verify and update access level if needed
          try {
            const properties = await client.getProperties();
            if (properties.publicAccess !== 'blob') {
              console.log(`Updating container access level to 'blob' for public access`);
              await client.setAccessPolicy({
                access: 'blob',
              });
            }
          } catch (updateError: any) {
            console.warn(`Could not update container access level: ${updateError.message}`);
          }
        } else {
          throw new Error(`Failed to create container '${containerName}': ${createError.message}`);
        }
      }
    } else {
      // Re-throw other errors
      throw new Error(`Failed to access container '${containerName}': ${error.message}`);
    }
  }
  
  // Cache the client for future use
  containerClient = client;
  return client;
}

/**
 * Upload an image from a URL to Azure Blob Storage
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
  filename?: string
): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await uploadImageBuffer(buffer, category, filename);
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    throw error;
  }
}

/**
 * Upload an image buffer to Azure Blob Storage
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
  filename?: string
): Promise<string> {
  try {
    const container = await getContainerClient();
    
    // Generate filename if not provided
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const finalFilename = filename || `${category}/${timestamp}-${randomId}.png`;
    
    // Ensure category prefix
    const blobName = finalFilename.startsWith(category + '/') 
      ? finalFilename 
      : `${category}/${finalFilename}`;

    const blockBlobClient = container.getBlockBlobClient(blobName);
    
    // Detect content type from filename or default to jpeg
    let contentType = 'image/jpeg';
    const extension = blobName.toLowerCase().split('.').pop();
    if (extension === 'png') contentType = 'image/png';
    else if (extension === 'gif') contentType = 'image/gif';
    else if (extension === 'webp') contentType = 'image/webp';
    
    // Upload with content type
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
    });

    // Return the public URL
    return blockBlobClient.url;
  } catch (error) {
    console.error('Error uploading image buffer:', error);
    throw error;
  }
}

/**
 * Upload a base64 image to Azure Blob Storage
 */
export async function uploadImageFromBase64(
  base64Data: string,
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
  filename?: string
): Promise<string> {
  // Remove data URL prefix if present
  const base64String = base64Data.includes(',') 
    ? base64Data.split(',')[1] 
    : base64Data;
  
  const buffer = Buffer.from(base64String, 'base64');
  return await uploadImageBuffer(buffer, category, filename);
}

/**
 * Delete an image from Azure Blob Storage
 */
export async function deleteImage(blobUrl: string): Promise<void> {
  try {
    const container = await getContainerClient();
    
    // Extract blob name from URL
    const urlParts = blobUrl.split('/');
    const blobName = urlParts.slice(urlParts.indexOf(container.containerName) + 1).join('/');
    
    const blockBlobClient = container.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

