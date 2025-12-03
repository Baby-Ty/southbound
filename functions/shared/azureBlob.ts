import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

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
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
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
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
  filename?: string
): Promise<string> {
  const container = await getContainerClient();
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const finalFilename = filename || `${category}/${timestamp}-${randomId}.png`;
  
  const blobName = finalFilename.startsWith(category + '/') 
    ? finalFilename 
    : `${category}/${finalFilename}`;

  const blockBlobClient = container.getBlockBlobClient(blobName);
  
  let contentType = 'image/jpeg';
  const extension = blobName.toLowerCase().split('.').pop();
  if (extension === 'png') contentType = 'image/png';
  else if (extension === 'gif') contentType = 'image/gif';
  else if (extension === 'webp') contentType = 'image/webp';
  
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
  });

  return blockBlobClient.url;
}

export async function uploadImageFromBase64(
  base64Data: string,
  category: 'cities' | 'highlights' | 'activities' | 'accommodations',
  filename?: string
): Promise<string> {
  const base64String = base64Data.includes(',') 
    ? base64Data.split(',')[1] 
    : base64Data;
  
  const buffer = Buffer.from(base64String, 'base64');
  return await uploadImageBuffer(buffer, category, filename);
}



