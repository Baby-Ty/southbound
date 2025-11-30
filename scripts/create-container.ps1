# Create Azure Blob Storage container
# Usage: .\scripts\create-container.ps1

Write-Host "📦 Azure Blob Storage Container Setup" -ForegroundColor Cyan
Write-Host ""

# Check if connection string is in environment or .env.local
$connString = $env:AZURE_STORAGE_CONNECTION_STRING

if (-not $connString) {
    # Try to read from .env.local
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local" | Select-String -Pattern "AZURE_STORAGE_CONNECTION_STRING"
        if ($envContent) {
            $connString = ($envContent -split "=", 2)[1].Trim()
        }
    }
}

if (-not $connString) {
    Write-Host "❌ Azure Storage connection string not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please either:" -ForegroundColor Yellow
    Write-Host "  1. Set AZURE_STORAGE_CONNECTION_STRING environment variable" -ForegroundColor White
    Write-Host "  2. Add it to .env.local file" -ForegroundColor White
    Write-Host "  3. Run: .\scripts\add-azure-env.ps1" -ForegroundColor White
    exit 1
}

$containerName = $env:AZURE_STORAGE_CONTAINER_NAME
if (-not $containerName) {
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local" | Select-String -Pattern "AZURE_STORAGE_CONTAINER_NAME"
        if ($envContent) {
            $containerName = ($envContent -split "=", 2)[1].Trim()
        }
    }
    if (-not $containerName) {
        $containerName = "southbound-images"
    }
}

Write-Host "Creating container '$containerName'..." -ForegroundColor Green

az storage container create `
    --name $containerName `
    --connection-string $connString `
    --public-access blob

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Container created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Error creating container. It might already exist." -ForegroundColor Yellow
}

