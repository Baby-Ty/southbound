"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
const azureBlob_1 = require("../shared/azureBlob");
const cors_1 = require("../shared/cors");
async function uploadImage(context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: cors_1.corsHeaders,
        };
        return;
    }
    try {
        context.log('[upload-image] Processing upload request');
        const body = req.body;
        const { imageUrl, imageData, category, filename } = body;
        context.log(`[upload-image] Category: ${category}, hasImageUrl: ${!!imageUrl}, hasImageData: ${!!imageData}`);
        if (!imageUrl && !imageData) {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Either imageUrl or imageData is required' }, 400);
            return;
        }
        if (!category) {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Category is required' }, 400);
            return;
        }
        const validCategories = ['cities', 'highlights', 'activities', 'accommodations', 'route-cards', 'trip-templates', 'countries'];
        if (!validCategories.includes(category)) {
            context.res = (0, cors_1.createCorsResponse)({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` }, 400);
            return;
        }
        let blobUrl;
        try {
            if (imageData) {
                context.log('[upload-image] Uploading from base64 data');
                blobUrl = await (0, azureBlob_1.uploadImageFromBase64)(imageData, category, filename);
            }
            else if (imageUrl) {
                context.log('[upload-image] Uploading from URL');
                blobUrl = await (0, azureBlob_1.uploadImageFromUrl)(imageUrl, category, filename);
            }
            else {
                context.res = (0, cors_1.createCorsResponse)({ error: 'Either imageUrl or imageData is required' }, 400);
                return;
            }
            context.log(`[upload-image] Successfully uploaded to: ${blobUrl}`);
        }
        catch (uploadError) {
            context.log(`[upload-image] Upload error: ${uploadError.message}`);
            context.log(`[upload-image] Stack: ${uploadError.stack}`);
            throw uploadError;
        }
        context.res = (0, cors_1.createCorsResponse)({
            success: true,
            blobUrl,
            message: 'Image uploaded successfully',
        });
        return;
    }
    catch (error) {
        context.log(`[upload-image] Error uploading image: ${error instanceof Error ? error.message : String(error)}`);
        context.log(`[upload-image] Error stack: ${error.stack}`);
        context.res = (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to upload image',
            details: error.stack
        }, 500);
        return;
    }
}
module.exports = { uploadImage };
