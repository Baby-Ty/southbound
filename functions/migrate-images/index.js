"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateImages = migrateImages;
const cosmos_cities_1 = require("../shared/cosmos-cities");
const azureBlob_1 = require("../shared/azureBlob");
const cors_1 = require("../shared/cors");
function isBlobUrl(url) {
    if (!url)
        return false;
    return url.includes('.blob.core.windows.net') || url.includes('blob.core.windows.net');
}
function shouldMigrate(url) {
    if (!url)
        return false;
    if (isBlobUrl(url))
        return false;
    return url.startsWith('http://') || url.startsWith('https://');
}
async function migrateImageUrl(imageUrl, category, cityName) {
    if (!shouldMigrate(imageUrl)) {
        return imageUrl;
    }
    try {
        const filename = cityName
            ? `${category}/${cityName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
            : undefined;
        const blobUrl = await (0, azureBlob_1.uploadImageFromUrl)(imageUrl, category, filename);
        return blobUrl;
    }
    catch (error) {
        console.error(`Failed to migrate image ${imageUrl}:`, error.message);
        return imageUrl;
    }
}
async function migrateCityImages(city) {
    const updates = {};
    let hasChanges = false;
    if (city.imageUrl && shouldMigrate(city.imageUrl)) {
        const migratedUrl = await migrateImageUrl(city.imageUrl, 'cities', city.city);
        if (migratedUrl !== city.imageUrl) {
            updates.imageUrl = migratedUrl;
            hasChanges = true;
        }
    }
    if (city.imageUrls && city.imageUrls.length > 0) {
        const migratedUrls = await Promise.all(city.imageUrls.map(url => migrateImageUrl(url, 'cities', city.city)));
        const urlsChanged = migratedUrls.some((url, idx) => url !== city.imageUrls[idx]);
        if (urlsChanged) {
            updates.imageUrls = migratedUrls;
            hasChanges = true;
        }
    }
    if (city.highlightImages && city.highlightImages.length > 0) {
        const migratedUrls = await Promise.all(city.highlightImages.map(url => migrateImageUrl(url, 'highlights', city.city)));
        const urlsChanged = migratedUrls.some((url, idx) => url !== city.highlightImages[idx]);
        if (urlsChanged) {
            updates.highlightImages = migratedUrls;
            hasChanges = true;
        }
    }
    if (city.activityImages && city.activityImages.length > 0) {
        const migratedUrls = await Promise.all(city.activityImages.map(url => migrateImageUrl(url, 'activities', city.city)));
        const urlsChanged = migratedUrls.some((url, idx) => url !== city.activityImages[idx]);
        if (urlsChanged) {
            updates.activityImages = migratedUrls;
            hasChanges = true;
        }
    }
    if (city.accommodationImages && city.accommodationImages.length > 0) {
        const migratedUrls = await Promise.all(city.accommodationImages.map(url => migrateImageUrl(url, 'accommodations', city.city)));
        const urlsChanged = migratedUrls.some((url, idx) => url !== city.accommodationImages[idx]);
        if (urlsChanged) {
            updates.accommodationImages = migratedUrls;
            hasChanges = true;
        }
    }
    return hasChanges ? updates : {};
}
async function migrateImages(context, req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: cors_1.corsHeaders,
        };
        return;
    }
    try {
        const body = req.body;
        const { cityId, dryRun = false } = body;
        if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
            context.res = (0, cors_1.createCorsResponse)({ error: 'Azure Blob Storage is not configured' }, 500);
            return;
        }
        if (cityId) {
            const { getCity } = await Promise.resolve().then(() => __importStar(require('../shared/cosmos-cities')));
            const city = await getCity(cityId);
            if (!city) {
                context.res = (0, cors_1.createCorsResponse)({ error: 'City not found' }, 404);
                return;
            }
            const updates = await migrateCityImages(city);
            if (dryRun) {
                context.res = (0, cors_1.createCorsResponse)({
                    success: true,
                    dryRun: true,
                    city: city.city,
                    updates,
                    message: 'Dry run completed. No changes were saved.',
                });
                return;
            }
            if (Object.keys(updates).length > 0) {
                await (0, cosmos_cities_1.updateCity)(cityId, updates);
                context.res = (0, cors_1.createCorsResponse)({
                    success: true,
                    city: city.city,
                    updates,
                    message: 'City images migrated successfully',
                });
                return;
            }
            context.res = (0, cors_1.createCorsResponse)({
                success: true,
                city: city.city,
                message: 'No images needed migration (all already in blob storage)',
            });
            return;
        }
        else {
            const cities = await (0, cosmos_cities_1.getAllCities)();
            const results = {
                total: cities.length,
                migrated: 0,
                skipped: 0,
                failed: 0,
                details: [],
            };
            for (const city of cities) {
                try {
                    const updates = await migrateCityImages(city);
                    if (dryRun) {
                        if (Object.keys(updates).length > 0) {
                            results.migrated++;
                            results.details.push({
                                city: city.city,
                                status: 'would migrate',
                                updates,
                            });
                        }
                        else {
                            results.skipped++;
                            results.details.push({
                                city: city.city,
                                status: 'already migrated',
                            });
                        }
                    }
                    else {
                        if (Object.keys(updates).length > 0) {
                            await (0, cosmos_cities_1.updateCity)(city.id, updates);
                            results.migrated++;
                            results.details.push({
                                city: city.city,
                                status: 'migrated',
                                updates,
                            });
                        }
                        else {
                            results.skipped++;
                            results.details.push({
                                city: city.city,
                                status: 'already migrated',
                            });
                        }
                    }
                }
                catch (error) {
                    results.failed++;
                    results.details.push({
                        city: city.city,
                        status: `failed: ${error.message}`,
                    });
                }
            }
            context.res = (0, cors_1.createCorsResponse)({
                success: true,
                dryRun,
                results,
                message: dryRun
                    ? 'Dry run completed. No changes were saved.'
                    : 'Migration completed',
            });
            return;
        }
    }
    catch (error) {
        context.log(`Migration error: ${error instanceof Error ? error.message : String(error)}`);
        context.res = (0, cors_1.createCorsResponse)({
            error: error.message || 'Failed to migrate images',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500);
        return;
    }
}
module.exports = { migrateImages };
