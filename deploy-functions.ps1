Write-Host "Deploying to southbnd-functions.azurewebsites.net..." -ForegroundColor Cyan

$publishProfile = [xml](Get-Content "southbnd-functions (1).PublishSettings")
$zipProfile = $publishProfile.publishData.publishProfile | Where-Object { $_.publishMethod -eq "ZipDeploy" }

if (-not $zipProfile) {
    Write-Host "Error: ZipDeploy profile not found" -ForegroundColor Red
    exit 1
}

$username = $zipProfile.userName
$password = $zipProfile.userPWD
$deployUrl = "https://$($zipProfile.publishUrl)/api/zipdeploy"

Write-Host "Target: $deployUrl" -ForegroundColor Gray
Write-Host "Uploading functions-deploy.zip..." -ForegroundColor Yellow

$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{ Authorization = "Basic $base64Auth" }

try {
    $response = Invoke-WebRequest -Uri $deployUrl -Method POST -Headers $headers -InFile functions-deploy.zip -ContentType "application/zip" -UseBasicParsing -TimeoutSec 300
    
    Write-Host ""
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Wait 1-2 minutes for Functions to restart" -ForegroundColor White
    Write-Host "2. Test: https://southbnd-functions.azurewebsites.net/api/trip-templates" -ForegroundColor White
    Write-Host "3. Check: https://southbnd.co.za" -ForegroundColor White
}
catch {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}
