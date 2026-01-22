# Restart Azure Functions
# This script stops any running Azure Functions processes and starts a new one

Write-Host "🛑 Stopping any running Azure Functions processes..." -ForegroundColor Yellow

# Find and stop func processes
$funcProcesses = Get-Process | Where-Object { $_.ProcessName -like "*func*" -or $_.CommandLine -like "*func*" }
if ($funcProcesses) {
    $funcProcesses | ForEach-Object {
        Write-Host "  Stopping process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "  No Azure Functions processes found" -ForegroundColor Gray
}

# Wait a moment
Start-Sleep -Seconds 2

Write-Host "`n🚀 Starting Azure Functions..." -ForegroundColor Green
Write-Host "  Navigate to: functions directory" -ForegroundColor Gray
Write-Host "  Command: func start" -ForegroundColor Gray
Write-Host "`n⚠️  Please run this manually in a new terminal:" -ForegroundColor Yellow
Write-Host "   cd functions" -ForegroundColor Cyan
Write-Host "   func start" -ForegroundColor Cyan
Write-Host "`nPress any key to open a new terminal window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Try to start in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\..\functions'; Write-Host 'Starting Azure Functions...' -ForegroundColor Green; func start"
