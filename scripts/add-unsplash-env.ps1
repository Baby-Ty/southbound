# PowerShell script to add Unsplash API key to .env.local
# Usage: .\scripts\add-unsplash-env.ps1

$envFile = ".env.local"
$keyName = "NEXT_PUBLIC_UNSPLASH_ACCESS_KEY"

Write-Host "🔑 Unsplash API Key Setup" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType File | Out-Null
}

# Read existing content
$content = Get-Content $envFile -ErrorAction SilentlyContinue

# Check if key already exists
$keyExists = $content | Where-Object { $_ -match "^$keyName=" }

if ($keyExists) {
    Write-Host "⚠️  Unsplash API key already exists in .env.local" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Do you want to update it? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit
    }
    # Remove old key
    $content = $content | Where-Object { $_ -notmatch "^$keyName=" }
}

# Get API key from user
Write-Host ""
Write-Host "📝 To get your Unsplash API key:" -ForegroundColor Cyan
Write-Host "   1. Go to https://unsplash.com/developers" -ForegroundColor White
Write-Host "   2. Sign in or create an account" -ForegroundColor White
Write-Host "   3. Click 'New Application'" -ForegroundColor White
Write-Host "   4. Fill out the form and accept terms" -ForegroundColor White
Write-Host "   5. Copy your 'Access Key'" -ForegroundColor White
Write-Host ""
$apiKey = Read-Host "Enter your Unsplash Access Key"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ API key cannot be empty!" -ForegroundColor Red
    exit 1
}

# Add new key
$newLine = "$keyName=$apiKey"
$content += $newLine

# Write back to file
$content | Set-Content $envFile

Write-Host ""
Write-Host "✅ Unsplash API key added to .env.local" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Don't forget to restart your dev server:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""


