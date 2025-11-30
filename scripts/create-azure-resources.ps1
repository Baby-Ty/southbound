# Create Azure Web App and Functions App
# Prerequisites: Azure CLI installed and logged in (az login)

param(
    [string]$ResourceGroupName = "southbound-rg",
    [string]$Location = "South Africa North",
    [string]$WebAppName = "southbound-app",
    [string]$FunctionsAppName = "southbound-functions",
    [string]$StorageAccountName = "southboundimages214153",  # Use existing or create new
    [string]$AppServicePlanName = "southbound-plan"
)

Write-Host "🚀 Creating Azure Resources for Southbnd" -ForegroundColor Cyan
Write-Host ""

# Check if logged in to Azure
Write-Host "Checking Azure login..." -ForegroundColor Yellow
$account = az account show 2>$null
if (-not $account) {
    Write-Host "❌ Not logged in to Azure. Please run: az login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in to Azure" -ForegroundColor Green
Write-Host ""

# Get subscription ID
$subscriptionId = (az account show --query id -o tsv)
Write-Host "Subscription ID: $subscriptionId" -ForegroundColor Gray
Write-Host ""

# Create resource group
Write-Host "📦 Creating resource group: $ResourceGroupName" -ForegroundColor Yellow
az group create --name $ResourceGroupName --location "$Location" --output none
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Resource group created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Resource group may already exist" -ForegroundColor Yellow
}
Write-Host ""

# Create App Service Plan (Basic B1 for custom domains)
Write-Host "📋 Creating App Service Plan: $AppServicePlanName" -ForegroundColor Yellow
az appservice plan create `
    --name $AppServicePlanName `
    --resource-group $ResourceGroupName `
    --location "$Location" `
    --sku B1 `
    --is-linux `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ App Service Plan created" -ForegroundColor Green
} else {
    Write-Host "⚠️  App Service Plan may already exist" -ForegroundColor Yellow
}
Write-Host ""

# Create Web App
Write-Host "🌐 Creating Web App: $WebAppName" -ForegroundColor Yellow
az webapp create `
    --name $WebAppName `
    --resource-group $ResourceGroupName `
    --plan $AppServicePlanName `
    --runtime "NODE:20-lts" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Web App created: https://$WebAppName.azurewebsites.net" -ForegroundColor Green
} else {
    Write-Host "⚠️  Web App may already exist" -ForegroundColor Yellow
}
Write-Host ""

# Check if storage account exists
Write-Host "💾 Checking storage account: $StorageAccountName" -ForegroundColor Yellow
$storageExists = az storage account show --name $StorageAccountName --resource-group $ResourceGroupName 2>$null
if (-not $storageExists) {
    Write-Host "⚠️  Storage account not found. Creating new one..." -ForegroundColor Yellow
    az storage account create `
        --name $StorageAccountName `
        --resource-group $ResourceGroupName `
        --location "$Location" `
        --sku Standard_LRS `
        --output none
    Write-Host "✅ Storage account created" -ForegroundColor Green
} else {
    Write-Host "✅ Using existing storage account" -ForegroundColor Green
}
Write-Host ""

# Create Functions App
Write-Host "⚡ Creating Functions App: $FunctionsAppName" -ForegroundColor Yellow
az functionapp create `
    --name $FunctionsAppName `
    --resource-group $ResourceGroupName `
    --storage-account $StorageAccountName `
    --plan $AppServicePlanName `
    --runtime "node" `
    --runtime-version "20" `
    --functions-version "4" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Functions App created: https://$FunctionsAppName.azurewebsites.net" -ForegroundColor Green
} else {
    Write-Host "⚠️  Functions App may already exist" -ForegroundColor Yellow
}
Write-Host ""

# Get publish profiles
Write-Host "📄 Getting publish profiles..." -ForegroundColor Yellow
Write-Host ""

$webAppProfile = az webapp deployment list-publishing-profiles `
    --name $WebAppName `
    --resource-group $ResourceGroupName `
    --xml `
    --output tsv

$functionsProfile = az functionapp deployment list-publishing-profiles `
    --name $FunctionsAppName `
    --resource-group $ResourceGroupName `
    --xml `
    --output tsv

# Save publish profiles to files
$webAppProfile | Out-File -FilePath "webapp-publish-profile.xml" -Encoding UTF8
$functionsProfile | Out-File -FilePath "functions-publish-profile.xml" -Encoding UTF8

Write-Host "✅ Publish profiles saved:" -ForegroundColor Green
Write-Host "   - webapp-publish-profile.xml" -ForegroundColor Gray
Write-Host "   - functions-publish-profile.xml" -ForegroundColor Gray
Write-Host ""

# Display summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Azure Resources Created Successfully!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
Write-Host "   Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "   Web App:        https://$WebAppName.azurewebsites.net" -ForegroundColor White
Write-Host "   Functions App:  https://$FunctionsAppName.azurewebsites.net" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Add GitHub Secrets (see configure-github-secrets.ps1)" -ForegroundColor White
Write-Host "   2. Configure environment variables in Azure Portal" -ForegroundColor White
Write-Host "   3. Configure custom domains" -ForegroundColor White
Write-Host ""

