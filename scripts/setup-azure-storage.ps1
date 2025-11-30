# Azure Blob Storage Setup Script for Southbnd (PowerShell)
# Run: .\scripts\setup-azure-storage.ps1

$ErrorActionPreference = "Stop"

$resourceGroup = "southbound-rg"
$storageAccountName = "southboundimages" + (Get-Date -Format "yyyyMMddHHmmss").Substring(8)
$location = "eastus"
$containerName = "southbound-images"

Write-Host "Setting up Azure Blob Storage..." -ForegroundColor Cyan

# Check Azure CLI
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Azure CLI not installed. Install: https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}

# Check login
$account = az account show 2>$null
if (-not $account) {
    Write-Host "Logging in to Azure..." -ForegroundColor Yellow
    az login
}

# Create resource group
Write-Host "Creating resource group..." -ForegroundColor Green
az group create --name $resourceGroup --location $location --output none

# Create storage account
Write-Host "Creating storage account..." -ForegroundColor Green
az storage account create `
    --resource-group $resourceGroup `
    --name $storageAccountName `
    --location $location `
    --sku Standard_LRS `
    --kind StorageV2 `
    --access-tier Hot `
    --output none

# Get connection string
Write-Host "Retrieving connection string..." -ForegroundColor Green
$connectionString = az storage account show-connection-string `
    --resource-group $resourceGroup `
    --name $storageAccountName `
    --query "connectionString" --output tsv

# Create container
Write-Host "Creating container..." -ForegroundColor Green
az storage container create `
    --name $containerName `
    --connection-string $connectionString `
    --public-access blob `
    --output none

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Add to .env.local:" -ForegroundColor Yellow
Write-Host "AZURE_STORAGE_CONNECTION_STRING=`"$connectionString`"" -ForegroundColor White
Write-Host "AZURE_STORAGE_CONTAINER_NAME=`"$containerName`"" -ForegroundColor White
Write-Host ""

