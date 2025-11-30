# Fix corrupted .env.local file
# This script creates a template .env.local file - you'll need to fill in your actual credentials

$envFile = ".env.local"
$backupFile = ".env.local.backup"

# Create backup if file exists
if (Test-Path $envFile) {
    Copy-Item $envFile $backupFile -Force
    Write-Host "Created backup: $backupFile" -ForegroundColor Yellow
}

# Create template file
$content = @"
# Sanity CMS Configuration
# Get these from https://sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production

# CosmosDB Configuration
# Get these from Azure Portal > Cosmos DB > Keys
COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOSDB_KEY=your-cosmosdb-key-here
COSMOSDB_DATABASE_ID=southbound

# Azure Blob Storage Configuration
# Get connection string from Azure Portal > Storage Account > Access Keys
AZURE_STORAGE_CONNECTION_STRING=your-connection-string-here
AZURE_STORAGE_CONTAINER_NAME=southbound-images

# OpenAI Configuration (for image generation)
# Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your-openai-api-key-here

# Unsplash Configuration (for image search)
# Get from https://unsplash.com/developers
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here
"@

# Write template content
Set-Content -Path $envFile -Value $content
Write-Host "✅ Created template .env.local file" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Edit .env.local and replace placeholder values with your actual credentials!" -ForegroundColor Yellow
Write-Host "   See README.md or ENV_SETUP.md for detailed instructions." -ForegroundColor Gray

