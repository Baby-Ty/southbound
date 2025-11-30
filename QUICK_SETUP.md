# Quick Setup Guide - CosmosDB Migration

You already have CosmosDB set up! Just need to get your credentials and create a `.env.local` file.

## Step 1: Get Your CosmosDB Credentials

You have two options:

### Option A: Use the PowerShell Script (Easiest)
```powershell
.\get-cosmos-credentials.ps1
```

This will output your credentials. Copy them!

### Option B: Get from Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to `southbound-cosmos-1183` Cosmos DB account
3. Go to **Keys** section
4. Copy:
   - **URI** → This is your `COSMOSDB_ENDPOINT`
   - **Primary Key** → This is your `COSMOSDB_KEY`

## Step 2: Create .env.local File

Create a file named `.env.local` in the project root with:

```env
COSMOSDB_ENDPOINT=https://southbound-cosmos-1183.documents.azure.com:443/
COSMOSDB_KEY=<paste-your-primary-key-here>
COSMOSDB_DATABASE_ID=southbound
```

**Important**: Replace `<paste-your-primary-key-here>` with the actual key from Step 1!

## Step 3: Run the Migration

```powershell
npx tsx scripts/migrate-cities-to-cosmos.ts
```

You should see:
```
🚀 Starting city migration to CosmosDB...
✅ Database: southbound
✅ Container: cities
📦 Processing europe (12 cities)...
  ✅ Migrated Lisbon, Portugal
  ...
✨ Migration complete!
```

## Step 4: Verify

1. Visit `/hub/destinations/cities` - you should see all cities
2. Try editing a city - changes should save
3. Test the route builder - it should use CosmosDB data

## Troubleshooting

### "COSMOSDB_ENDPOINT and COSMOSDB_KEY must be set"
- Make sure `.env.local` exists in the project root
- Check that the file has no typos
- Make sure there are no spaces around the `=` sign
- Restart your terminal after creating the file

### "Failed to connect"
- Verify your CosmosDB account is active in Azure Portal
- Check that your key is correct (no extra spaces)
- Make sure the endpoint URL ends with `:443/`

### Still having issues?
Run the PowerShell script to get fresh credentials:
```powershell
.\get-cosmos-credentials.ps1
```

