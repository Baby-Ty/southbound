"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
const azureBlob_1 = require("../shared/azureBlob");
const cors_1 = require("../shared/cors");
async function uploadImage(request, context) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: cors_1.corsHeaders,
        };
    }
    try {
        const body = await request.json();
        const { imageUrl, imageData, category, filename } = body;
        if (!imageUrl && !imageData) {
            return (0, cors_1.createCorsResponse)({ error: 'Either imageUrl or imageData is required' }, 400);
        }
        if (!category) {
            return (0, cors_1.createCorsResponse)({ error: 'Category is required' }, 400);
        }
        const validCategories = ['cities', 'highlights', 'activities', 'accommodations'];
        if (!validCategories.includes(category)) {
            return (0, cors_1.createCorsResponse)({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` }, 400);
        }
        let blobUrl;
        if (imageData) {
            blobUrl = await (0, azureBlob_1.uploadImageFromBase64)(imageData, category, filename);
        }
        else if (imageUrl) {
            blobUrl = await (0, azureBlob_1.uploadImageFromUrl)(imageUrl, category, filename);
        }
        else {
            return (0, cors_1.createCorsResponse)({ error: 'Either imageUrl or imageData is required' }, 400);
        }
        return (0, cors_1.createCorsResponse)({
            success: true,
            blobUrl,
            message: 'Image uploaded successfully',
        });
    }
    catch (error) {
        context.log(`Error uploading image: ${error instanceof Error ? error.message : String(error)}`);
        return (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to upload image',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500);
    }
}
module.exports = { uploadImage };
