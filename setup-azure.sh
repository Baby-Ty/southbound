#!/bin/bash

# Azure Setup Script for Southbound Project
# This script sets up all necessary Azure resources

set -e  # Exit on error

# Configuration variables
RESOURCE_GROUP="southbound-rg"
LOCATION="eastus"  # Change to your preferred region
COSMOS_ACCOUNT="southbound-cosmos"
COSMOS_DATABASE="southbound"
COSMOS_CONTAINER="savedRoutes"
STATIC_WEB_APP="southbound-web"
SKU="Free"  # Options: Free, Standard

echo "🚀 Starting Azure setup for Southbound project..."
echo ""

# Step 1: Login to Azure
echo "📋 Step 1: Logging in to Azure..."
az login
echo "✅ Logged in successfully"
echo ""

# Step 2: Set subscription (if you have multiple)
echo "📋 Step 2: Checking Azure subscription..."
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo "Current subscription: $SUBSCRIPTION_ID"
read -p "Do you want to use this subscription? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Available subscriptions:"
    az account list --output table
    read -p "Enter subscription ID: " SUBSCRIPTION_ID
    az account set --subscription "$SUBSCRIPTION_ID"
fi
echo "✅ Subscription set"
echo ""

# Step 3: Create Resource Group
echo "📋 Step 3: Creating resource group '$RESOURCE_GROUP'..."
az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION"
echo "✅ Resource group created"
echo ""

# Step 4: Create Cosmos DB Account
echo "📋 Step 4: Creating Cosmos DB account '$COSMOS_ACCOUNT'..."
az cosmosdb create \
    --name "$COSMOS_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --default-consistency-level Session \
    --locations regionName="$LOCATION" failoverPriority=0 \
    --enable-free-tier true
echo "✅ Cosmos DB account created"
echo ""

# Step 5: Create Cosmos DB Database
echo "📋 Step 5: Creating Cosmos DB database '$COSMOS_DATABASE'..."
az cosmosdb sql database create \
    --account-name "$COSMOS_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --name "$COSMOS_DATABASE"
echo "✅ Cosmos DB database created"
echo ""

# Step 6: Create Cosmos DB Container
echo "📋 Step 6: Creating Cosmos DB container '$COSMOS_CONTAINER'..."
az cosmosdb sql container create \
    --account-name "$COSMOS_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --database-name "$COSMOS_DATABASE" \
    --name "$COSMOS_CONTAINER" \
    --partition-key-path "/id" \
    --throughput 400
echo "✅ Cosmos DB container created"
echo ""

# Step 7: Get Cosmos DB credentials
echo "📋 Step 7: Retrieving Cosmos DB credentials..."
COSMOS_ENDPOINT=$(az cosmosdb show \
    --name "$COSMOS_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query documentEndpoint -o tsv)

COSMOS_KEY=$(az cosmosdb keys list \
    --name "$COSMOS_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query primaryMasterKey -o tsv)

echo "✅ Cosmos DB credentials retrieved"
echo ""

# Step 8: Create Azure Static Web App
echo "📋 Step 8: Creating Azure Static Web App '$STATIC_WEB_APP'..."
# Note: Static Web Apps creation requires GitHub/GitLab integration
# We'll create it manually or use Azure Portal
echo "⚠️  Azure Static Web Apps requires GitHub/GitLab integration"
echo "   You can create it manually via Azure Portal or use:"
echo "   az staticwebapp create --name $STATIC_WEB_APP --resource-group $RESOURCE_GROUP --location $LOCATION --sku $SKU"
echo ""

# Step 9: Display configuration
echo "═══════════════════════════════════════════════════════════"
echo "✅ Azure setup complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📝 Add these to your .env.local file:"
echo ""
echo "COSMOSDB_ENDPOINT=$COSMOS_ENDPOINT"
echo "COSMOSDB_KEY=$COSMOS_KEY"
echo "COSMOSDB_DATABASE_ID=$COSMOS_DATABASE"
echo ""
echo "📝 Or set them as environment variables in Azure Static Web App:"
echo "   - COSMOSDB_ENDPOINT: $COSMOS_ENDPOINT"
echo "   - COSMOSDB_KEY: $COSMOS_KEY"
echo "   - COSMOSDB_DATABASE_ID: $COSMOS_DATABASE"
echo ""
echo "🔗 Cosmos DB Account: https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DocumentDB/databaseAccounts/$COSMOS_ACCOUNT"
echo ""
echo "📚 Next steps:"
echo "   1. Add the environment variables to your .env.local file"
echo "   2. Deploy your Next.js app to Azure Static Web Apps"
echo "   3. Configure environment variables in Azure Portal"
echo ""




