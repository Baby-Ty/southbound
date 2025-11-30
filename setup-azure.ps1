# Azure Setup Script for Southbound Project (PowerShell)
# This script sets up all necessary Azure resources

$ErrorActionPreference = "Stop"

# Configuration variables
$RESOURCE_GROUP = "southbound-rg"
$LOCATION = "eastus"  # Change to your preferred region
$COSMOS_ACCOUNT = "southbound-cosmos"
$COSMOS_DATABASE = "southbound"
$COSMOS_CONTAINER = "savedRoutes"
$STATIC_WEB_APP = "southbound-web"
$SKU = "Free"  # Options: Free, Standard

Write-Host "🚀 Starting Azure setup for Southbound project..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to Azure
Write-Host "📋 Step 1: Logging in to Azure..." -ForegroundColor Yellow
az login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to login to Azure" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Set subscription (if you have multiple)
Write-Host "📋 Step 2: Checking Azure subscription..." -ForegroundColor Yellow
$SUBSCRIPTION_ID = az account show --query id -o tsv
Write-Host "Current subscription: $SUBSCRIPTION_ID" -ForegroundColor Cyan
$response = Read-Host "Do you want to use this subscription? (y/n)"
if ($response -ne "y" -and $response -ne "Y") {
    Write-Host "Available subscriptions:"
    az account list --output table
    $SUBSCRIPTION_ID = Read-Host "Enter subscription ID"
    az account set --subscription $SUBSCRIPTION_ID
}
Write-Host "✅ Subscription set" -ForegroundColor Green
Write-Host ""

# Step 3: Create Resource Group
Write-Host "📋 Step 3: Creating resource group '$RESOURCE_GROUP'..." -ForegroundColor Yellow
az group create `
    --name $RESOURCE_GROUP `
    --location $LOCATION
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create resource group" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Resource group created" -ForegroundColor Green
Write-Host ""

# Step 4: Create Cosmos DB Account
Write-Host "📋 Step 4: Creating Cosmos DB account '$COSMOS_ACCOUNT'..." -ForegroundColor Yellow
az cosmosdb create `
    --name $COSMOS_ACCOUNT `
    --resource-group $RESOURCE_GROUP `
    --default-consistency-level Session `
    --locations regionName=$LOCATION failoverPriority=0 `
    --enable-free-tier true
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Cosmos DB account" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Cosmos DB account created" -ForegroundColor Green
Write-Host ""

# Step 5: Create Cosmos DB Database
Write-Host "📋 Step 5: Creating Cosmos DB database '$COSMOS_DATABASE'..." -ForegroundColor Yellow
az cosmosdb sql database create `
    --account-name $COSMOS_ACCOUNT `
    --resource-group $RESOURCE_GROUP `
    --name $COSMOS_DATABASE
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Cosmos DB database" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Cosmos DB database created" -ForegroundColor Green
Write-Host ""

# Step 6: Create Cosmos DB Container
Write-Host "📋 Step 6: Creating Cosmos DB container '$COSMOS_CONTAINER'..." -ForegroundColor Yellow
az cosmosdb sql container create `
    --account-name $COSMOS_ACCOUNT `
    --resource-group $RESOURCE_GROUP `
    --database-name $COSMOS_DATABASE `
    --name $COSMOS_CONTAINER `
    --partition-key-path "/id" `
    --throughput 400
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Cosmos DB container" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Cosmos DB container created" -ForegroundColor Green
Write-Host ""

# Step 7: Get Cosmos DB credentials
Write-Host "📋 Step 7: Retrieving Cosmos DB credentials..." -ForegroundColor Yellow
$COSMOS_ENDPOINT = az cosmosdb show `
    --name $COSMOS_ACCOUNT `
    --resource-group $RESOURCE_GROUP `
    --query documentEndpoint -o tsv

$COSMOS_KEY = az cosmosdb keys list `
    --name $COSMOS_ACCOUNT `
    --resource-group $RESOURCE_GROUP `
    --query primaryMasterKey -o tsv

Write-Host "✅ Cosmos DB credentials retrieved" -ForegroundColor Green
Write-Host ""

# Step 8: Create Azure Static Web App
Write-Host "📋 Step 8: Creating Azure Static Web App '$STATIC_WEB_APP'..." -ForegroundColor Yellow
Write-Host "⚠️  Azure Static Web Apps requires GitHub/GitLab integration" -ForegroundColor Yellow
Write-Host "   You can create it manually via Azure Portal or use:" -ForegroundColor Yellow
Write-Host "   az staticwebapp create --name $STATIC_WEB_APP --resource-group $RESOURCE_GROUP --location $LOCATION --sku $SKU" -ForegroundColor Cyan
Write-Host ""

# Step 9: Display configuration
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Azure setup complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Add these to your .env.local file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "COSMOSDB_ENDPOINT=$COSMOS_ENDPOINT" -ForegroundColor White
Write-Host "COSMOSDB_KEY=$COSMOS_KEY" -ForegroundColor White
Write-Host "COSMOSDB_DATABASE_ID=$COSMOS_DATABASE" -ForegroundColor White
Write-Host ""
Write-Host "📝 Or set them as environment variables in Azure Static Web App:" -ForegroundColor Yellow
Write-Host "   - COSMOSDB_ENDPOINT: $COSMOS_ENDPOINT" -ForegroundColor White
Write-Host "   - COSMOSDB_KEY: $COSMOS_KEY" -ForegroundColor White
Write-Host "   - COSMOSDB_DATABASE_ID: $COSMOS_DATABASE" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Cosmos DB Account: https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DocumentDB/databaseAccounts/$COSMOS_ACCOUNT" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Add the environment variables to your .env.local file" -ForegroundColor White
Write-Host "   2. Deploy your Next.js app to Azure Static Web Apps" -ForegroundColor White
Write-Host "   3. Configure environment variables in Azure Portal" -ForegroundColor White
Write-Host ""


