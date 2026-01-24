import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CompressionResult {
  inputPath: string;
  outputPath: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  reductionPercent: number;
}

async function compressImage(inputPath: string, quality: number = 80): Promise<CompressionResult> {
  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  const inputStats = await stat(inputPath);
  const originalSizeKB = inputStats.size / 1024;
  
  await sharp(inputPath)
    .webp({ quality })
    .toFile(outputPath);
  
  const outputStats = await stat(outputPath);
  const compressedSizeKB = outputStats.size / 1024;
  const reductionPercent = ((inputStats.size - outputStats.size) / inputStats.size) * 100;
  
  console.log(`✓ ${path.basename(inputPath)}: ${originalSizeKB.toFixed(2)}KB → ${compressedSizeKB.toFixed(2)}KB (${reductionPercent.toFixed(1)}% reduction)`);
  
  return {
    inputPath,
    outputPath,
    originalSizeKB,
    compressedSizeKB,
    reductionPercent,
  };
}

async function main() {
  console.log('🖼️  Starting local image compression...\n');
  
  // List of images to compress
  const images = [
    'public/europe.png',
    'public/euro rail.png',
    'public/SouthAmerica.png',
    'public/southeastasia.png',
    'public/images/about-graphic.png',
    'public/images/faq-image.png',
    'public/images/form-graphic.png',
    'public/images/form-image.png',
  ];
  
  const results: CompressionResult[] = [];
  let totalOriginalKB = 0;
  let totalCompressedKB = 0;
  
  for (const imagePath of images) {
    try {
      const fullPath = path.join(process.cwd(), imagePath);
      const result = await compressImage(fullPath);
      results.push(result);
      totalOriginalKB += result.originalSizeKB;
      totalCompressedKB += result.compressedSizeKB;
    } catch (error: any) {
      console.error(`✗ Failed to compress ${imagePath}: ${error.message}`);
    }
  }
  
  console.log('\n📊 Compression Summary:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total original size:    ${totalOriginalKB.toFixed(2)} KB (${(totalOriginalKB/1024).toFixed(2)} MB)`);
  console.log(`Total compressed size:  ${totalCompressedKB.toFixed(2)} KB (${(totalCompressedKB/1024).toFixed(2)} MB)`);
  console.log(`Total saved:            ${(totalOriginalKB - totalCompressedKB).toFixed(2)} KB (${(((totalOriginalKB - totalCompressedKB)/totalOriginalKB) * 100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log('📝 Files to update:');
  console.log('The following component files reference the compressed images and need updates:\n');
  
  const filesToUpdate = [
    'src/components/RouteBuilder/RegionStep.tsx - region images',
    'src/components/discover/RegionSelector.tsx - region images',
    'src/lib/tripTemplates.ts - euro rail image',
    'src/components/OurPromiseSection.tsx - UI graphics',
    'src/components/FAQPageClient.tsx - faq-image',
    'src/components/LetsChatForm.tsx - form-image or form-graphic',
    'src/app/about/page.tsx - about-graphic',
  ];
  
  filesToUpdate.forEach(file => console.log(`  - ${file}`));
  
  console.log('\n✅ Compression complete! Next steps:');
  console.log('1. Update all component references from .png to .webp');
  console.log('2. Test that images display correctly in the application');
  console.log('3. Delete original PNG files once verified');
}

main().catch(console.error);
