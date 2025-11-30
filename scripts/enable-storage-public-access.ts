/**
 * Enable public access on Azure Storage Account
 * 
 * This script enables public access at the storage account level.
 * Note: This must be done via Azure Portal or Azure CLI as it requires
 * storage account-level permissions.
 * 
 * Usage:
 *   npm run enable-storage-public-access
 * 
 * Or follow the manual steps in Azure Portal
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function enablePublicAccess() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    console.error('❌ Error: AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
    process.exit(1);
  }

  // Extract storage account name from connection string
  const accountMatch = connectionString.match(/AccountName=([^;]+)/);
  const accountName = accountMatch ? accountMatch[1] : 'unknown';

  console.log('🔧 Enabling Public Access on Azure Storage Account');
  console.log(`\nStorage Account: ${accountName}`);
  console.log('\n⚠️  Note: This requires Azure Portal access or Azure CLI');
  console.log('\n📋 Manual Steps (Azure Portal):');
  console.log('\n1. Go to Azure Portal: https://portal.azure.com');
  console.log(`2. Navigate to: Storage accounts > ${accountName}`);
  console.log('3. In the left menu, click "Configuration" under "Settings"');
  console.log('4. Find "Allow Blob public access" setting');
  console.log('5. Set it to "Enabled"');
  console.log('6. Click "Save"');
  console.log('\n📋 Alternative (Azure CLI):');
  console.log(`\naz storage account update \\`);
  console.log(`  --name ${accountName} \\`);
  console.log(`  --resource-group <your-resource-group> \\`);
  console.log(`  --allow-blob-public-access true`);
  console.log('\n📋 After enabling public access:');
  console.log('1. Set container access level to "Blob" (anonymous read access)');
  console.log('2. Run: npm run configure-blob-cors');
  console.log('\n✅ Once public access is enabled, images will be publicly accessible!');
}

if (require.main === module) {
  enablePublicAccess();
}

export { enablePublicAccess };


