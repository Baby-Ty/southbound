# Fix .env.local File

Your `.env.local` file exists but dotenv isn't loading it. Here's how to fix it:

## Option 1: Manual Fix (Recommended)

1. **Open `.env.local` in a text editor** (VS Code, Notepad++, etc.)

2. **Make sure it looks exactly like this** (no trailing spaces, no quotes):

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production

# CosmosDB Configuration
COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOSDB_KEY=your-cosmosdb-key-here
COSMOSDB_DATABASE_ID=southbound

# Azure Blob Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=your-connection-string-here
AZURE_STORAGE_CONTAINER_NAME=southbound-images

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Unsplash Configuration
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here
```

3. **Important checks:**
   - No spaces after the `=` sign
   - No spaces at the end of lines
   - No quotes around values
   - File encoding should be UTF-8
   - Make sure there's a blank line at the end
   - Replace all placeholder values with your actual credentials

4. **Save the file**

5. **Restart your development server** if it's running

## Option 2: Use Setup Scripts

Run the provided setup scripts to add credentials interactively:

```powershell
# For CosmosDB
.\get-cosmos-credentials.ps1

# For Azure Storage
.\scripts\add-azure-env.ps1

# For Unsplash
.\scripts\add-unsplash-env.ps1
```

## Option 3: Use Environment Variables Directly

If the file still doesn't work, you can set environment variables in PowerShell:

```powershell
$env:COSMOSDB_ENDPOINT="https://your-account.documents.azure.com:443/"
$env:COSMOSDB_KEY="your-cosmosdb-key-here"
$env:COSMOSDB_DATABASE_ID="southbound"
npx tsx scripts/migrate-cities-to-cosmos.ts
```

## Getting Your Credentials

- **CosmosDB**: Azure Portal > Cosmos DB Account > Keys
- **Azure Storage**: Azure Portal > Storage Account > Access Keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Unsplash**: https://unsplash.com/developers

## Verify It's Working

After fixing, you should see output like:
```
🚀 Starting city migration to CosmosDB...
✅ Database: southbound
✅ Container: cities
📦 Processing europe (12 cities)...
  ✅ Migrated Lisbon, Portugal
  ...
```

If you still see "COSMOSDB_ENDPOINT and COSMOSDB_KEY must be set", the file still isn't being read correctly.

