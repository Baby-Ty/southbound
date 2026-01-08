# Configure GitHub Secrets for Azure Deployment
# Prerequisites: GitHub CLI installed (gh) and authenticated

param(
    [string]$WebAppName = "southbound-app",
    [string]$FunctionsAppName = "southbound-functions",
    [string]$ResourceGroupName = "southbound-rg"
)

Write-Host "🔐 Configuring GitHub Secrets for Azure Deployment" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://cli.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Configure secrets manually in GitHub:" -ForegroundColor Yellow
    Write-Host "   1. Go to your repository → Settings → Secrets and variables → Actions" -ForegroundColor White
    Write-Host "   2. Add the following secrets:" -ForegroundColor White
    Write-Host "      - AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor Gray
    Write-Host "      - AZURE_FUNCTIONS_PUBLISH_PROFILE" -ForegroundColor Gray
    Write-Host "      - AZURE_WEBAPP_NAME" -ForegroundColor Gray
    Write-Host "      - AZURE_FUNCTIONS_NAME" -ForegroundColor Gray
    exit 1
}

# Check if logged in to GitHub
Write-Host "Checking GitHub authentication..." -ForegroundColor Yellow
$ghAuth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated to GitHub. Please run: gh auth login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Authenticated to GitHub" -ForegroundColor Green
Write-Host ""

# Check if Azure CLI is available
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Get publish profiles from Azure
Write-Host "📄 Getting publish profiles from Azure..." -ForegroundColor Yellow

$webAppProfile = az webapp deployment list-publishing-profiles `
    --name $WebAppName `
    --resource-group $ResourceGroupName `
    --xml `
    --output tsv

if (-not $webAppProfile) {
    Write-Host "❌ Failed to get Web App publish profile" -ForegroundColor Red
    Write-Host "   Make sure the Web App exists: $WebAppName" -ForegroundColor Yellow
    exit 1
}

$functionsProfile = az functionapp deployment list-publishing-profiles `
    --name $FunctionsAppName `
    --resource-group $ResourceGroupName `
    --xml `
    --output tsv

if (-not $functionsProfile) {
    Write-Host "❌ Failed to get Functions App publish profile" -ForegroundColor Red
    Write-Host "   Make sure the Functions App exists: $FunctionsAppName" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Publish profiles retrieved" -ForegroundColor Green
Write-Host ""

# Set GitHub secrets
Write-Host "🔐 Setting GitHub secrets..." -ForegroundColor Yellow
Write-Host ""

# Web App publish profile
Write-Host "Setting AZURE_WEBAPP_PUBLISH_PROFILE..." -ForegroundColor Gray
echo $webAppProfile | gh secret set AZURE_WEBAPP_PUBLISH_PROFILE
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AZURE_WEBAPP_PUBLISH_PROFILE set" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to set AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor Red
}

# Functions App publish profile
Write-Host "Setting AZURE_FUNCTIONS_PUBLISH_PROFILE..." -ForegroundColor Gray
echo $functionsProfile | gh secret set AZURE_FUNCTIONS_PUBLISH_PROFILE
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AZURE_FUNCTIONS_PUBLISH_PROFILE set" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to set AZURE_FUNCTIONS_PUBLISH_PROFILE" -ForegroundColor Red
}

# App names
Write-Host "Setting AZURE_WEBAPP_NAME..." -ForegroundColor Gray
echo $WebAppName | gh secret set AZURE_WEBAPP_NAME
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AZURE_WEBAPP_NAME set" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to set AZURE_WEBAPP_NAME" -ForegroundColor Red
}

Write-Host "Setting AZURE_FUNCTIONS_NAME..." -ForegroundColor Gray
echo $FunctionsAppName | gh secret set AZURE_FUNCTIONS_NAME
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AZURE_FUNCTIONS_NAME set" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to set AZURE_FUNCTIONS_NAME" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ GitHub Secrets Configured!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Configure environment variables in Azure Portal" -ForegroundColor White
Write-Host "   2. Configure custom domains" -ForegroundColor White
Write-Host "   3. Push to master branch to trigger deployment" -ForegroundColor White
Write-Host ""






