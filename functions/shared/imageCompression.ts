import sharp from 'sharp';

export interface CompressionResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
  format: string;
}

export interface CompressionOptions {
  quality?: number; // 1-100, default 80
  maxWidth?: number; // Optional max width in pixels
  maxHeight?: number; // Optional max height in pixels
}

/**
 * Compress an image buffer to WebP format
 * @param imageBuffer Original image buffer
 * @param options Compression options
 * @returns Compressed buffer with metadata
 */
export async function compressToWebP(
  imageBuffer: Buffer,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    quality = 80,
    maxWidth,
    maxHeight,
  } = options;

  const originalSize = imageBuffer.length;

  try {
    let sharpInstance = sharp(imageBuffer);

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
  } catch (error: any) {
    // If WebP conversion fails, try optimizing the original format
    console.warn('WebP conversion failed, attempting format optimization:', error.message);
    
    try {
      const metadata = await sharp(imageBuffer).metadata();
      const format = metadata.format || 'jpeg';
      
      let optimizedBuffer: Buffer;
      
      if (format === 'png') {
        // Optimize PNG
        optimizedBuffer = await sharp(imageBuffer)
          .png({ compressionLevel: 9, quality: quality })
          .toBuffer();
      } else if (format === 'jpeg' || format === 'jpg') {
        // Optimize JPEG
        optimizedBuffer = await sharp(imageBuffer)
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
      } else {
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
    } catch (fallbackError: any) {
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
export async function getImageMetadata(imageBuffer: Buffer): Promise<{
  width?: number;
  height?: number;
  format?: string;
  size: number;
}> {
  const metadata = await sharp(imageBuffer).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: imageBuffer.length,
  };
}
