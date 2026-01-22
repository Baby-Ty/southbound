"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressToWebP = compressToWebP;
exports.getImageMetadata = getImageMetadata;
const sharp_1 = __importDefault(require("sharp"));
/**
 * Compress an image buffer to WebP format
 * @param imageBuffer Original image buffer
 * @param options Compression options
 * @returns Compressed buffer with metadata
 */
async function compressToWebP(imageBuffer, options = {}) {
    const { quality = 80, maxWidth, maxHeight, } = options;
    const originalSize = imageBuffer.length;
    try {
        let sharpInstance = (0, sharp_1.default)(imageBuffer);
        // Apply resizing if needed
        if (maxWidth || maxHeight) {
            sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }
        // Convert to WebP with specified quality
        const compressedBuffer = await sharpInstance
            .webp({ quality })
            .toBuffer();
        const compressedSize = compressedBuffer.length;
        const reductionPercent = ((originalSize - compressedSize) / originalSize) * 100;
        return {
            buffer: compressedBuffer,
            originalSize,
            compressedSize,
            reductionPercent: Math.round(reductionPercent * 100) / 100,
            format: 'webp',
        };
    }
    catch (error) {
        // If WebP conversion fails, try optimizing the original format
        console.warn('WebP conversion failed, attempting format optimization:', error.message);
        try {
            const metadata = await (0, sharp_1.default)(imageBuffer).metadata();
            const format = metadata.format || 'jpeg';
            let optimizedBuffer;
            if (format === 'png') {
                // Optimize PNG
                optimizedBuffer = await (0, sharp_1.default)(imageBuffer)
                    .png({ compressionLevel: 9, quality: quality })
                    .toBuffer();
            }
            else if (format === 'jpeg' || format === 'jpg') {
                // Optimize JPEG
                optimizedBuffer = await (0, sharp_1.default)(imageBuffer)
                    .jpeg({ quality, mozjpeg: true })
                    .toBuffer();
            }
            else {
                // For other formats, return original
                throw new Error(`Unsupported format: ${format}`);
            }
            const compressedSize = optimizedBuffer.length;
            const reductionPercent = ((originalSize - compressedSize) / originalSize) * 100;
            return {
                buffer: optimizedBuffer,
                originalSize,
                compressedSize,
                reductionPercent: Math.round(reductionPercent * 100) / 100,
                format: format || 'unknown',
            };
        }
        catch (fallbackError) {
            // If all compression fails, return original with 0% reduction
            console.error('Image compression failed completely:', fallbackError);
            return {
                buffer: imageBuffer,
                originalSize,
                compressedSize: originalSize,
                reductionPercent: 0,
                format: 'unknown',
            };
        }
    }
}
/**
 * Get image metadata without compression
 */
async function getImageMetadata(imageBuffer) {
    const metadata = await (0, sharp_1.default)(imageBuffer).metadata();
    return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: imageBuffer.length,
    };
}
