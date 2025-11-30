# Configure Environment Variables in Azure Web App and Functions App
# This script helps you set environment variables interactively

param(
    [string]$WebAppName = "southbound-app",
    [string]$FunctionsAppName = "southbound-functions",
    [string]$ResourceGroupName = "southbound-rg"
)

Write-Host "⚙️  Configure Azure Environment Variables" -ForegroundColor Cyan
Write-Host ""

# Check Azure CLI
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

Write-Host "This script will help you set environment variables interactively." -ForegroundColor Yellow
Write-Host "You can also set them manually in Azure Portal." -ForegroundColor Yellow
Write-Host ""

# Web App Environment Variables
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🌐 Web App Environment Variables (Frontend)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$webAppVars = @{}

Write-Host "Enter NEXT_PUBLIC_SANITY_PROJECT_ID (or press Enter to skip):" -ForegroundColor White
$sanityId = Read-Host
if ($sanityId) { $webAppVars["NEXT_PUBLIC_SANITY_PROJECT_ID"] = $sanityId }

Write-Host "Enter NEXT_PUBLIC_SANITY_DATASET (default: production):" -ForegroundColor White
$sanityDataset = Read-Host
if (-not $sanityDataset) { $sanityDataset = "production" }
$webAppVars["NEXT_PUBLIC_SANITY_DATASET"] = $sanityDataset

Write-Host "Enter NEXT_PUBLIC_FUNCTIONS_URL (default: https://$FunctionsAppName.azurewebsites.net):" -ForegroundColor White
$functionsUrl = Read-Host
if (-not $functionsUrl) { $functionsUrl = "https://$FunctionsAppName.azurewebsites.net" }
$webAppVars["NEXT_PUBLIC_FUNCTIONS_URL"] = $functionsUrl

# Set Web App variables
if ($webAppVars.Count -gt 0) {
    Write-Host ""
    Write-Host "Setting Web App environment variables..." -ForegroundColor Yellow
    foreach ($key in $webAppVars.Keys) {
        az webapp config appsettings set `
            --name $WebAppName `
            --resource-group $ResourceGroupName `
            --settings "$key=$($webAppVars[$key])" `
            --output none
        Write-Host "  ✅ $key" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "⚡ Functions App Environment Variables (Backend)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$functionsVars = @{}

Write-Host "Enter COSMOSDB_ENDPOINT (or press Enter to skip):" -ForegroundColor White
$cosmosEndpoint = Read-Host
if ($cosmosEndpoint) { $functionsVars["COSMOSDB_ENDPOINT"] = $cosmosEndpoint }

Write-Host "Enter COSMOSDB_KEY (or press Enter to skip):" -ForegroundColor White
$cosmosKey = Read-Host
if ($cosmosKey) { $functionsVars["COSMOSDB_KEY"] = $cosmosKey }

Write-Host "Enter COSMOSDB_DATABASE_ID (default: southbound):" -ForegroundColor White
$cosmosDb = Read-Host
if (-not $cosmosDb) { $cosmosDb = "southbound" }
$functionsVars["COSMOSDB_DATABASE_ID"] = $cosmosDb

Write-Host "Enter AZURE_STORAGE_CONNECTION_STRING (or press Enter to skip):" -ForegroundColor White
$storageConn = Read-Host
if ($storageConn) { $functionsVars["AZURE_STORAGE_CONNECTION_STRING"] = $storageConn }

Write-Host "Enter AZURE_STORAGE_CONTAINER_NAME (default: southbound-images):" -ForegroundColor White
$containerName = Read-Host
if (-not $containerName) { $containerName = "southbound-images" }
$functionsVars["AZURE_STORAGE_CONTAINER_NAME"] = $containerName

Write-Host "Enter OPENAI_API_KEY (or press Enter to skip):" -ForegroundColor White
$openaiKey = Read-Host
if ($openaiKey) { $functionsVars["OPENAI_API_KEY"] = $openaiKey }

Write-Host "Enter UNSPLASH_ACCESS_KEY (or press Enter to skip):" -ForegroundColor White
$unsplashKey = Read-Host
if ($unsplashKey) { $functionsVars["UNSPLASH_ACCESS_KEY"] = $unsplashKey }

# Set Functions App variables
if ($functionsVars.Count -gt 0) {
    Write-Host ""
    Write-Host "Setting Functions App environment variables..." -ForegroundColor Yellow
    foreach ($key in $functionsVars.Keys) {
        az functionapp config appsettings set `
            --name $FunctionsAppName `
            --resource-group $ResourceGroupName `
            --settings "$key=$($functionsVars[$key])" `
            --output none
        Write-Host "  ✅ $key" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Environment Variables Configured!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: You can also configure these in Azure Portal:" -ForegroundColor Yellow
Write-Host "   Web App:    Azure Portal -> $WebAppName -> Configuration -> Application settings" -ForegroundColor White
Write-Host "   Functions:  Azure Portal -> $FunctionsAppName -> Configuration -> Application settings" -ForegroundColor White
Write-Host ""

