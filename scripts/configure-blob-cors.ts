/**
 * Configure CORS settings for Azure Blob Storage container
 * 
 * This script sets up CORS rules to allow images to be accessed from web browsers
 * 
 * Usage:
 *   npm run configure-blob-cors
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import { BlobServiceClient } from '@azure/storage-blob';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function configureBlobCors() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'southbound-images';

  if (!connectionString) {
    console.error('❌ Error: AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
    process.exit(1);
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const serviceClient = blobServiceClient;

    console.log('🔧 Configuring CORS for Azure Blob Storage...');
    console.log(`Container: ${containerName}`);

    // Configure CORS rules
    // Allow all origins for public blob access (you can restrict this in production)
    const corsRules = [
      {
        allowedOrigins: '*', // Use string '*' instead of array for all origins
        allowedMethods: 'GET,HEAD,OPTIONS', // Comma-separated string
        allowedHeaders: '*', // Use string '*' instead of array
        exposedHeaders: '*', // Use string '*' instead of array
        maxAgeInSeconds: 3600, // Cache preflight for 1 hour
      },
    ];

    await serviceClient.setProperties({
      cors: corsRules,
    });

    console.log('✅ CORS configuration updated successfully!');
    console.log('\nCORS Rules:');
    corsRules.forEach((rule, index) => {
      console.log(`  Rule ${index + 1}:`);
      console.log(`    Allowed Origins: ${rule.allowedOrigins}`);
      console.log(`    Allowed Methods: ${rule.allowedMethods}`);
      console.log(`    Max Age: ${rule.maxAgeInSeconds}s`);
    });

    // Verify container exists and has public access
    const containerClient = serviceClient.getContainerClient(containerName);
    try {
      const properties = await containerClient.getProperties();
      console.log(`\n📦 Container Properties:`);
      console.log(`    Name: ${containerName}`);
      console.log(`    Public Access: ${properties.publicAccess || 'private'}`);
      
      if (properties.publicAccess !== 'blob') {
        console.log(`\n⚠️  Warning: Container public access is set to '${properties.publicAccess || 'private'}'`);
        console.log(`   For public image access, it should be set to 'blob'`);
        console.log(`   Note: Container access level must be set manually in Azure Portal:`);
        console.log(`   1. Go to Azure Portal > Storage Account > Containers`);
        console.log(`   2. Select '${containerName}' container`);
        console.log(`   3. Click 'Change access level'`);
        console.log(`   4. Select 'Blob (anonymous read access for blobs only)'`);
        console.log(`   5. Click 'OK'`);
      } else {
        console.log(`   ✅ Container has public blob access (correct)`);
      }
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log(`\n⚠️  Container '${containerName}' does not exist. Creating it...`);
        await containerClient.create({
          access: 'blob', // Public read access to blobs
        });
        console.log(`   ✅ Container created with public blob access`);
      } else {
        throw error;
      }
    }

    console.log('\n✅ Configuration complete!');
    console.log('\n📝 Note: In production, consider restricting allowedOrigins to your domain(s)');
    console.log('\n⚠️  IMPORTANT: If you get "409 Public access is not permitted" errors:');
    console.log('   You must enable public blob access at the STORAGE ACCOUNT level:');
    console.log('   1. Run: npm run enable-storage-public-access');
    console.log('   2. Follow the instructions to enable in Azure Portal');
    console.log('   3. Then set container access level to "Blob"');
  } catch (error: any) {
    console.error('❌ Error configuring CORS:', error.message);
    if (error.statusCode) {
      console.error(`   Status Code: ${error.statusCode}`);
    }
    if (error.statusCode === 409 || error.message.includes('Public access is not permitted')) {
      console.error('\n⚠️  This error indicates public access is disabled at the storage account level.');
      console.error('   Run: npm run enable-storage-public-access');
      console.error('   Then follow the instructions to enable public access in Azure Portal.');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  configureBlobCors();
}

export { configureBlobCors };

