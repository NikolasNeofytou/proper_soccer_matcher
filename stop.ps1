Write-Host "Stopping all Proper Soccer Matcher containers..." -ForegroundColor Yellow

# Stop and remove all containers, networks
docker-compose down

Write-Host "All services stopped!" -ForegroundColor Green
