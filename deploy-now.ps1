# Quick deploy script for Azure Functions
Write-Host "Deploying Azure Functions..." -ForegroundColor Cyan

# Read publish profile (using new tenant profile)
$publishProfile = [xml](Get-Content functions-publish-profile-new.xml)
$zipProfile = $publishProfile.publishData.publishProfile | Where-Object { $_.publishMethod -eq "ZipDeploy" }
$username = $zipProfile.userName
$password = $zipProfile.userPWD
$deployUrl = "https://$($zipProfile.publishUrl)/api/zipdeploy"

Write-Host "Uploading to: $deployUrl" -ForegroundColor Yellow

# Create auth header
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{ Authorization = "Basic $base64Auth" }

# Deploy
$response = Invoke-WebRequest -Uri $deployUrl -Method POST -Headers $headers -InFile functions-deploy.zip -ContentType "application/zip" -UseBasicParsing

Write-Host ""
Write-Host "Deployment successful!" -ForegroundColor Green
Write-Host "Status: $($response.StatusCode)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait 1-2 minutes for functions to restart" -ForegroundColor White
Write-Host "2. Test: https://api.southbnd.co.za/api/trip-templates?curated=true" -ForegroundColor White
Write-Host "3. Test Hub: https://southbnd.co.za/hub/templates" -ForegroundColor White
