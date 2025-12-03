# Deploy Azure Functions using Zip Deploy API
# Run this from the project root directory

Write-Host "🚀 Deploying Azure Functions..." -ForegroundColor Cyan

# Check if zip file exists
if (-not (Test-Path "functions-deploy.zip")) {
    Write-Host "❌ Error: functions-deploy.zip not found!" -ForegroundColor Red
    Write-Host "   Make sure you're running this from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Read publish profile
if (-not (Test-Path "functions-publish-profile.xml")) {
    Write-Host "❌ Error: functions-publish-profile.xml not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Reading publish profile..." -ForegroundColor Gray
$publishProfile = [xml](Get-Content functions-publish-profile.xml)
$zipProfile = $publishProfile.publishData.publishProfile | Where-Object { $_.publishMethod -eq "ZipDeploy" }

if (-not $zipProfile) {
    Write-Host "❌ Error: ZipDeploy profile not found in publish profile!" -ForegroundColor Red
    exit 1
}

$username = $zipProfile.userName
$password = $zipProfile.userPWD
$deployUrl = "https://$($zipProfile.publishUrl)/api/zipdeploy"

Write-Host "📦 Preparing deployment..." -ForegroundColor Gray
Write-Host "   File: functions-deploy.zip" -ForegroundColor Gray
Write-Host "   Size: $((Get-Item functions-deploy.zip).Length) bytes" -ForegroundColor Gray
Write-Host "   URL: $deployUrl" -ForegroundColor Gray

# Create Basic Auth header
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))

$headers = @{
    Authorization = "Basic $base64Auth"
}

Write-Host ""
Write-Host "⬆️  Uploading deployment package..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $deployUrl -Method POST -Headers $headers -InFile functions-deploy.zip -ContentType "application/zip" -UseBasicParsing
    
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Wait 1-2 minutes for functions to restart" -ForegroundColor White
    Write-Host "   2. Test: https://api.southbnd.co.za/api/images-search?query=test" -ForegroundColor White
    Write-Host "   3. Check logs: Azure Portal → southbound-functions → Log stream" -ForegroundColor White
}
catch {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 401) {
            Write-Host ""
            Write-Host "💡 Tip: Publish profile may have expired. Regenerate it from Azure Portal." -ForegroundColor Yellow
        }
    }
    
    exit 1
}
