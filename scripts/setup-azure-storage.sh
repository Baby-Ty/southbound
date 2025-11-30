#!/bin/bash

# Azure Blob Storage Setup Script for Southbnd
set -e

RESOURCE_GROUP="southbound-rg"
STORAGE_ACCOUNT_NAME="southboundimages$(date +%s | tail -c 6)"
LOCATION="eastus"
CONTAINER_NAME="southbound-images"

echo "🚀 Setting up Azure Blob Storage..."

# Check Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not installed. Install: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Login check
if ! az account show &> /dev/null; then
    echo "🔐 Logging in to Azure..."
    az login
fi

# Create resource group
echo "📦 Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

# Create storage account
echo "💾 Creating storage account..."
az storage account create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$STORAGE_ACCOUNT_NAME" \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --kind StorageV2 \
    --access-tier Hot \
    --output none

# Get connection string
CONNECTION_STRING=$(az storage account show-connection-string \
    --resource-group "$RESOURCE_GROUP" \
    --name "$STORAGE_ACCOUNT_NAME" \
    --query "connectionString" --output tsv)

# Create container
echo "📁 Creating container..."
az storage container create \
    --name "$CONTAINER_NAME" \
    --connection-string "$CONNECTION_STRING" \
    --public-access blob \
    --output none

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Add to .env.local:"
echo "AZURE_STORAGE_CONNECTION_STRING=\"$CONNECTION_STRING\""
echo "AZURE_STORAGE_CONTAINER_NAME=\"$CONTAINER_NAME\""
echo ""
