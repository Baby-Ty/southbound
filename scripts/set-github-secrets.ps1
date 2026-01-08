# Set GitHub Secrets using saved publish profiles
# Run this after: gh auth login

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Configuring GitHub Secrets" -ForegroundColor Cyan
Write-Host ""

# Check if authenticated
$authCheck = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Not authenticated to GitHub" -ForegroundColor Red
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Authenticated to GitHub" -ForegroundColor Green
Write-Host ""

# Check if publish profile files exist
if (-not (Test-Path "webapp-publish-profile.xml")) {
    Write-Host "ERROR: webapp-publish-profile.xml not found" -ForegroundColor Red
    Write-Host "Run: .\scripts\create-azure-resources.ps1 first" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "functions-publish-profile.xml")) {
    Write-Host "ERROR: functions-publish-profile.xml not found" -ForegroundColor Red
    Write-Host "Run: .\scripts\create-azure-resources.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Read publish profiles
Write-Host "Reading publish profiles..." -ForegroundColor Yellow
$webAppProfile = Get-Content "webapp-publish-profile.xml" -Raw
$functionsProfile = Get-Content "functions-publish-profile.xml" -Raw

Write-Host "Setting secrets..." -ForegroundColor Yellow
Write-Host ""

# Set Web App publish profile
Write-Host "Setting AZURE_WEBAPP_PUBLISH_PROFILE..." -ForegroundColor Gray
echo $webAppProfile | gh secret set AZURE_WEBAPP_PUBLISH_PROFILE
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: AZURE_WEBAPP_PUBLISH_PROFILE set" -ForegroundColor Green
} else {
    Write-Host "FAILED: Could not set AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor Red
    exit 1
}

# Set Functions App publish profile
Write-Host "Setting AZURE_FUNCTIONS_PUBLISH_PROFILE..." -ForegroundColor Gray
echo $functionsProfile | gh secret set AZURE_FUNCTIONS_PUBLISH_PROFILE
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: AZURE_FUNCTIONS_PUBLISH_PROFILE set" -ForegroundColor Green
} else {
    Write-Host "FAILED: Could not set AZURE_FUNCTIONS_PUBLISH_PROFILE" -ForegroundColor Red
    exit 1
}

# Set app names
Write-Host "Setting AZURE_WEBAPP_NAME..." -ForegroundColor Gray
echo "southbound-app" | gh secret set AZURE_WEBAPP_NAME
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: AZURE_WEBAPP_NAME set" -ForegroundColor Green
} else {
    Write-Host "FAILED: Could not set AZURE_WEBAPP_NAME" -ForegroundColor Red
    exit 1
}

Write-Host "Setting AZURE_FUNCTIONS_NAME..." -ForegroundColor Gray
echo "southbound-functions" | gh secret set AZURE_FUNCTIONS_NAME
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: AZURE_FUNCTIONS_NAME set" -ForegroundColor Green
} else {
    Write-Host "FAILED: Could not set AZURE_FUNCTIONS_NAME" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All GitHub Secrets Configured!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables in Azure Portal" -ForegroundColor White
Write-Host "2. Push to master branch to trigger deployment" -ForegroundColor White
Write-Host ""






