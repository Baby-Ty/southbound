# Set Azure environment variables from .env.local file
# This reads your local .env.local and sets the same variables in Azure

param(
    [string]$WebAppName = "southbound-app",
    [string]$FunctionsAppName = "southbound-functions",
    [string]$ResourceGroupName = "southbound-rg",
    [string]$EnvFile = ".env.local"
)

Write-Host "Setting Azure Environment Variables from .env.local" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path $EnvFile)) {
    Write-Host "ERROR: $EnvFile not found" -ForegroundColor Red
    Write-Host "Please create .env.local first or set variables manually in Azure Portal" -ForegroundColor Yellow
    exit 1
}

# Read .env.local
Write-Host "Reading $EnvFile..." -ForegroundColor Yellow
$envContent = Get-Content $EnvFile

# Parse environment variables
$envVars = @{}
foreach ($line in $envContent) {
    $line = $line.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line.Split("=", 2)
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            $envVars[$key] = $value
        }
    }
}

Write-Host "Found $($envVars.Count) environment variables" -ForegroundColor Green
Write-Host ""

# Separate Web App and Functions App variables
$webAppVars = @{}
$functionsVars = @{}

foreach ($key in $envVars.Keys) {
    if ($key.StartsWith("NEXT_PUBLIC_")) {
        $webAppVars[$key] = $envVars[$key]
    } elseif ($key -eq "COSMOSDB_ENDPOINT" -or 
              $key -eq "COSMOSDB_KEY" -or 
              $key -eq "COSMOSDB_DATABASE_ID" -or
              $key -eq "AZURE_STORAGE_CONNECTION_STRING" -or
              $key -eq "AZURE_STORAGE_CONTAINER_NAME" -or
              $key -eq "OPENAI_API_KEY" -or
              $key -eq "UNSPLASH_ACCESS_KEY" -or
              $key -eq "SANITY_PROJECT_ID" -or
              $key -eq "SANITY_API_TOKEN") {
        $functionsVars[$key] = $envVars[$key]
    }
}

# Set Functions URL for Web App if not already set
if (-not $webAppVars.ContainsKey("NEXT_PUBLIC_FUNCTIONS_URL")) {
    $webAppVars["NEXT_PUBLIC_FUNCTIONS_URL"] = "https://$FunctionsAppName.azurewebsites.net"
}

# Set Web App variables
if ($webAppVars.Count -gt 0) {
    Write-Host "Setting Web App environment variables..." -ForegroundColor Yellow
    $settings = @()
    foreach ($key in $webAppVars.Keys) {
        $settings += "$key=$($webAppVars[$key])"
        Write-Host "  - $key" -ForegroundColor Gray
    }
    
    az webapp config appsettings set `
        --name $WebAppName `
        --resource-group $ResourceGroupName `
        --settings $settings `
        --output none
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Web App variables set" -ForegroundColor Green
    } else {
        Write-Host "FAILED: Could not set Web App variables" -ForegroundColor Red
    }
    Write-Host ""
}

# Set Functions App variables
if ($functionsVars.Count -gt 0) {
    Write-Host "Setting Functions App environment variables..." -ForegroundColor Yellow
    $settings = @()
    foreach ($key in $functionsVars.Keys) {
        $settings += "$key=$($functionsVars[$key])"
        Write-Host "  - $key" -ForegroundColor Gray
    }
    
    az functionapp config appsettings set `
        --name $FunctionsAppName `
        --resource-group $ResourceGroupName `
        --settings $settings `
        --output none
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Functions App variables set" -ForegroundColor Green
    } else {
        Write-Host "FAILED: Could not set Functions App variables" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment Variables Configured!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Push to master branch to trigger deployment" -ForegroundColor Yellow
Write-Host ""






