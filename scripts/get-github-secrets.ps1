# Display GitHub Secrets Setup Instructions
# This script shows you what to copy/paste into GitHub

param(
    [string]$WebAppName = "southbound-app",
    [string]$FunctionsAppName = "southbound-functions"
)

Write-Host "🔐 GitHub Secrets Setup Instructions" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "webapp-publish-profile.xml")) {
    Write-Host "❌ webapp-publish-profile.xml not found" -ForegroundColor Red
    Write-Host "   Run: .\scripts\create-azure-resources.ps1 first" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "functions-publish-profile.xml")) {
    Write-Host "❌ functions-publish-profile.xml not found" -ForegroundColor Red
    Write-Host "   Run: .\scripts\create-azure-resources.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 Secret 1: AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions" -ForegroundColor White
Write-Host "2. Click 'New repository secret'" -ForegroundColor White
Write-Host "3. Name: AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor White
Write-Host "4. Value: Copy the content below (entire XML):" -ForegroundColor White
Write-Host ""
Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
Get-Content "webapp-publish-profile.xml" | Write-Host
Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Enter to continue to next secret..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 Secret 2: AZURE_FUNCTIONS_PUBLISH_PROFILE" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Click 'New repository secret' again" -ForegroundColor White
Write-Host "2. Name: AZURE_FUNCTIONS_PUBLISH_PROFILE" -ForegroundColor White
Write-Host "3. Value: Copy the content below (entire XML):" -ForegroundColor White
Write-Host ""
Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
Get-Content "functions-publish-profile.xml" | Write-Host
Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Enter to continue to next secret..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 Secret 3: AZURE_WEBAPP_NAME" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Click 'New repository secret'" -ForegroundColor White
Write-Host "2. Name: AZURE_WEBAPP_NAME" -ForegroundColor White
Write-Host "3. Value: $WebAppName" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to continue to next secret..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 Secret 4: AZURE_FUNCTIONS_NAME" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Click 'New repository secret'" -ForegroundColor White
Write-Host "2. Name: AZURE_FUNCTIONS_NAME" -ForegroundColor White
Write-Host "3. Value: $FunctionsAppName" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ All secrets configured!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables in Azure Portal" -ForegroundColor White
Write-Host "2. Push to master branch to trigger deployment" -ForegroundColor White
Write-Host ""

