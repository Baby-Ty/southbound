# Azure Setup Summary for Southbound

## ✅ Resources Created

### Resource Group
- **Name**: `southbound-rg`
- **Location**: `eastus`
- **Subscription**: VibeReview (19dcc571-9b58-4829-8f65-b38bf023f4f9)

### Azure Cosmos DB Account
- **Account Name**: `southbound-cosmos-1183`
- **Endpoint**: `https://southbound-cosmos-1183.documents.azure.com:443/`
- **Database**: `southbound`
- **Container**: `savedRoutes` (partition key: `/id`)
- **Consistency Level**: Session
- **Location**: East US

## 🔑 Getting Your Cosmos DB Credentials

Run these commands to get your connection credentials:

```powershell
# Get the endpoint (already known)
$endpoint = "https://southbound-cosmos-1183.documents.azure.com:443/"

# Get the primary key
$key = az cosmosdb keys list --name southbound-cosmos-1183 --resource-group southbound-rg --query primaryMasterKey -o tsv

# Display both
Write-Host "COSMOSDB_ENDPOINT=$endpoint"
Write-Host "COSMOSDB_KEY=$key"
Write-Host "COSMOSDB_DATABASE_ID=southbound"
```

Or get them via Azure Portal:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to `southbound-cosmos-1183` Cosmos DB account
3. Go to **Keys** section
4. Copy the **Primary Key** and **URI**

## 📝 Environment Variables

Add these to your `.env.local` file:

```env
COSMOSDB_ENDPOINT=https://southbound-cosmos-1183.documents.azure.com:443/
COSMOSDB_KEY=<your-primary-key-here>
COSMOSDB_DATABASE_ID=southbound
```

**⚠️ Important**: Never commit your `.env.local` file to version control!

## 🚀 Next Steps

### 1. Verify Cosmos DB Setup
```powershell
# List databases
az cosmosdb sql database list --account-name southbound-cosmos-1183 --resource-group southbound-rg

# List containers
az cosmosdb sql container list --account-name southbound-cosmos-1183 --resource-group southbound-rg --database-name southbound
```

### 2. Test Connection Locally
1. Add the environment variables to `.env.local`
2. Run your Next.js app: `npm run dev`
3. Test the route builder functionality

### 3. Deploy to Azure Static Web Apps (Optional)

For hosting your Next.js static export, you can create an Azure Static Web App:

```powershell
# Create Static Web App (requires GitHub repo)
az staticwebapp create \
  --name southbound-web \
  --resource-group southbound-rg \
  --location eastus \
  --sku Free
```

Or use Azure App Service for full Next.js support:

```powershell
# Create App Service Plan
az appservice plan create \
  --name southbound-plan \
  --resource-group southbound-rg \
  --sku FREE \
  --is-linux

# Create Web App
az webapp create \
  --name southbound-web \
  --resource-group southbound-rg \
  --plan southbound-plan \
  --runtime "NODE:20-lts"
```

### 4. Configure Environment Variables in Azure

If deploying to Azure, set environment variables:

**For Static Web Apps:**
- Go to Azure Portal → Static Web App → Configuration → Application settings
- Add:
  - `COSMOSDB_ENDPOINT`
  - `COSMOSDB_KEY`
  - `COSMOSDB_DATABASE_ID`

**For App Service:**
- Go to Azure Portal → App Service → Configuration → Application settings
- Add the same variables

## 📊 Resource Costs

- **Cosmos DB**: Free tier available (first 400 RU/s and 5GB storage free)
- **Resource Group**: No cost (just a container)
- **Static Web App**: Free tier available
- **App Service**: Free tier available (F1)

## 🔗 Useful Links

- [Azure Portal](https://portal.azure.com)
- [Cosmos DB Account](https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg/providers/Microsoft.DocumentDB/databaseAccounts/southbound-cosmos-1183)
- [Resource Group](https://portal.azure.com/#@/resource/subscriptions/19dcc571-9b58-4829-8f65-b38bf023f4f9/resourceGroups/southbound-rg)

## 🛠️ Management Commands

```powershell
# View all resources
az resource list --resource-group southbound-rg -o table

# Get Cosmos DB connection string
az cosmosdb keys list --name southbound-cosmos-1183 --resource-group southbound-rg

# Delete everything (if needed)
az group delete --name southbound-rg --yes
```

## 📚 Documentation

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/azure/cosmos-db/)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)



