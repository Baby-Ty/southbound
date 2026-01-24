"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageFromUrl = uploadImageFromUrl;
exports.uploadImageBuffer = uploadImageBuffer;
exports.uploadImageFromBase64 = uploadImageFromBase64;
exports.uploadActivityPhotos = uploadActivityPhotos;
const storage_blob_1 = require("@azure/storage-blob");
const imageCompression_1 = require("./imageCompression");
let blobServiceClient = null;
function getBlobServiceClient() {
    if (blobServiceClient) {
        return blobServiceClient;
    }
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
    }
    blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
    return blobServiceClient;
}
async function getContainerClient() {
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'southbound-images';
    const serviceClient = getBlobServiceClient();
    const client = serviceClient.getContainerClient(containerName);
    try {
        await client.createIfNotExists({
            access: 'blob',
        });
    }
    catch (error) {
        if (error.statusCode !== 409) {
            throw error;
        }
    }
    return client;
}
async function uploadImageFromUrl(imageUrl, category, filename) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return await uploadImageBuffer(buffer, category, filename);
}
async function uploadImageBuffer(buffer, category, filename, compress = false) {
    const container = await getContainerClient();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const originalFilename = filename || `${category}/${timestamp}-${randomId}.png`;
    let blobName = originalFilename.startsWith(category + '/')
        ? originalFilename
        : `${category}/${originalFilename}`;
    // Compress image if requested using JIMP (pure JavaScript, no native dependencies)
    let finalBuffer = buffer;
    let contentType = 'image/jpeg'; // Default content type
    if (compress) {
        try {
            console.log('Compressing image with JIMP...');
            const compressionResult = await (0, imageCompression_1.compressWithJimp)(buffer, { quality: 80 });
            finalBuffer = compressionResult.buffer;
            // Update blob name extension based on compressed format
            const extension = compressionResult.format === 'jpeg' ? '.jpg' : '.png';
            blobName = blobName.replace(/\.(png|jpg|jpeg|gif|webp)$/i, extension);
            contentType = compressionResult.format === 'jpeg' ? 'image/jpeg' : 'image/png';
            console.log(`Image compressed: ${compressionResult.originalSize} → ${compressionResult.compressedSize} bytes (${compressionResult.reductionPercent.toFixed(1)}% reduction)`);
        }
        catch (error) {
            console.error('Compression failed, uploading original:', error.message);
            // Fall back to original buffer if compression fails
            const extension = blobName.toLowerCase().split('.').pop();
            if (extension === 'png')
                contentType = 'image/png';
            else if (extension === 'gif')
                contentType = 'image/gif';
            else if (extension === 'webp')
                contentType = 'image/webp';
            else
                contentType = 'image/jpeg';
        }
    }
    else {
        // Determine content type from extension
        const extension = blobName.toLowerCase().split('.').pop();
        if (extension === 'png')
            contentType = 'image/png';
        else if (extension === 'gif')
            contentType = 'image/gif';
        else if (extension === 'webp')
            contentType = 'image/webp';
        else
            contentType = 'image/jpeg';
    }
    const blockBlobClient = container.getBlockBlobClient(blobName);
    await blockBlobClient.upload(finalBuffer, finalBuffer.length, {
        blobHTTPHeaders: {
            blobContentType: contentType,
        },
    });
    return blockBlobClient.url;
}
async function uploadImageFromBase64(base64Data, category, filename) {
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
async function uploadActivityPhotos(photoUrls, cityId, locationId) {
    const uploadedUrls = [];
    for (let i = 0; i < photoUrls.length; i++) {
        try {
            const photoUrl = photoUrls[i];
            const filename = `activities/${cityId}/${locationId}/${i}.jpg`;
            const blobUrl = await uploadImageFromUrl(photoUrl, 'activities', filename);
            uploadedUrls.push(blobUrl);
        }
        catch (error) {
            console.error(`Failed to upload activity photo ${i} for ${locationId}:`, error);
            // Continue with other photos even if one fails
            // Fallback: use original URL if blob upload fails
            uploadedUrls.push(photoUrls[i]);
        }
    }
    return uploadedUrls;
}
