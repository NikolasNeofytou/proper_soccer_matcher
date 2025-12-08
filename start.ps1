Write-Host "Stopping and removing existing containers..." -ForegroundColor Yellow

# Stop and remove all containers for this project
docker-compose down

Write-Host "Cleaning up..." -ForegroundColor Cyan

Write-Host "Starting Proper Soccer Matcher..." -ForegroundColor Green

# Build and start all services
docker-compose up --build
