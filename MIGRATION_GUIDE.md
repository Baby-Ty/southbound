# Migration Guide: Moving from Static Data to CosmosDB

This guide explains how to migrate your city data from static files to CosmosDB.

## Step 1: Set Up CosmosDB Credentials

Add these to your `.env.local`:

```bash
COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOSDB_KEY=your-cosmosdb-key-here
COSMOSDB_DATABASE_ID=southbound
```

## Step 2: Install tsx (for running TypeScript scripts)

```bash
npm install -D tsx
```

Or use ts-node if you prefer.

## Step 3: Run the Migration Script

```bash
npx tsx scripts/migrate-cities-to-cosmos.ts
```

This will:
- Create the `cities` container in CosmosDB
- Import all cities from `cityPresets.ts`
- Set all activities and accommodation as available by default
- Skip cities that already exist (safe to run multiple times)

## Step 4: Verify Migration

1. Check CosmosDB portal - you should see cities in the `cities` container
2. Visit `/hub/destinations/cities` - cities should appear
3. Try editing a city - changes should save

## Step 5: Update City Data (Optional)

After migration, you can:
- Disable cities you don't want to show
- Customize which activities are available per city
- Customize which accommodation types are available per city
- Add admin notes

## How It Works Now

### Data Flow:
1. **Route Builder** → Fetches cities from CosmosDB (falls back to static if not configured)
2. **Admin UI** → Reads/writes directly to CosmosDB
3. **User Route Customization** → Uses filtered activities/accommodation from CosmosDB

### Fallback Behavior:
- If CosmosDB is not configured → Uses static `cityPresets.ts`
- If CosmosDB fails → Falls back to static data
- This ensures the app always works, even without CosmosDB

## Troubleshooting

### Migration fails with "credentials not configured"
- Check your `.env.local` file
- Make sure variables are set correctly
- Restart your dev server after adding env vars

### Cities not showing in admin UI
- Check CosmosDB portal to verify cities were migrated
- Check browser console for errors
- Verify API endpoint `/api/cities` is working

### Changes not saving
- Check CosmosDB write permissions
- Verify your CosmosDB key has write access
- Check browser console for API errors

## Next Steps

1. ✅ Run migration script
2. ✅ Test admin UI at `/hub/destinations/cities`
3. ✅ Customize city settings (enable/disable activities, accommodation)
4. ✅ Test route builder - should use CosmosDB data
5. ✅ Remove Sanity dependencies (optional, if not using)

## Removing Sanity (Optional)

If you're not using Sanity for anything else, you can:

1. Remove Sanity packages:
   ```bash
   npm uninstall @sanity/client @sanity/image-url @sanity/types sanity @sanity/vision
   ```

2. Remove Sanity config files:
   - `sanity.config.ts`
   - `sanity.cli.ts`
   - `sanity/` directory

3. Remove Sanity scripts from `package.json`

But keep them if you might use Sanity for other content (like blog posts, FAQs, etc.)

