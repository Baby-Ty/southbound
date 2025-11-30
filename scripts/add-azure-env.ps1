# Add Azure Storage environment variables to .env.local
# Usage: .\scripts\add-azure-env.ps1

$envFile = ".env.local"

Write-Host "🔑 Azure Storage Setup" -ForegroundColor Cyan
Write-Host ""

# Check if variables already exist
$existing = Get-Content $envFile -ErrorAction SilentlyContinue | Select-String -Pattern "AZURE_STORAGE_CONNECTION_STRING"

if ($existing) {
    Write-Host "⚠️  Azure Storage variables already exist in .env.local" -ForegroundColor Yellow
    Write-Host "   If you want to update them, edit .env.local manually" -ForegroundColor Gray
    exit 0
}

Write-Host "📝 To get your Azure Storage connection string:" -ForegroundColor Cyan
Write-Host "   1. Go to https://portal.azure.com" -ForegroundColor White
Write-Host "   2. Navigate to your Storage Account" -ForegroundColor White
Write-Host "   3. Go to Access Keys section" -ForegroundColor White
Write-Host "   4. Copy the Connection String" -ForegroundColor White
Write-Host ""

$connString = Read-Host "Enter your Azure Storage Connection String"

if ([string]::IsNullOrWhiteSpace($connString)) {
    Write-Host "❌ Connection string cannot be empty" -ForegroundColor Red
    exit 1
}

$containerName = Read-Host "Enter container name (default: southbound-images)"
if ([string]::IsNullOrWhiteSpace($containerName)) {
    $containerName = "southbound-images"
}

# Ensure .env.local exists
if (-not (Test-Path $envFile)) {
    New-Item -Path $envFile -ItemType File | Out-Null
}

Add-Content -Path $envFile -Value ""
Add-Content -Path $envFile -Value "# Azure Blob Storage Configuration"
Add-Content -Path $envFile -Value "AZURE_STORAGE_CONNECTION_STRING=$connString"
Add-Content -Path $envFile -Value "AZURE_STORAGE_CONTAINER_NAME=$containerName"

Write-Host ""
Write-Host "✅ Azure Storage variables added to .env.local" -ForegroundColor Green

