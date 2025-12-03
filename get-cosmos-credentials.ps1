# Quick script to get Cosmos DB credentials

$COSMOS_ACCOUNT = "southbound-cosmos-1183"
$RESOURCE_GROUP = "southbound-rg"

Write-Host "Retrieving Cosmos DB credentials..." -ForegroundColor Cyan
Write-Host ""

$endpoint = az cosmosdb show --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv
$key = az cosmosdb keys list --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "Cosmos DB Credentials" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Add these to your .env.local file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "COSMOSDB_ENDPOINT=$endpoint" -ForegroundColor White
Write-Host "COSMOSDB_KEY=$key" -ForegroundColor White
Write-Host "COSMOSDB_DATABASE_ID=southbound" -ForegroundColor White
Write-Host ""




