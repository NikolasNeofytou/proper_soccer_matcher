Write-Host "Stopping and removing existing containers..." -ForegroundColor Yellow

# Stop and remove all containers for this project
docker-compose down

Write-Host "Cleaning up..." -ForegroundColor Cyan

Write-Host "Starting Proper Soccer Matcher in detached mode..." -ForegroundColor Green

# Build and start all services in background
docker-compose up --build -d

Write-Host ""
Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3000/api/v1" -ForegroundColor Cyan
Write-Host "PostgreSQL: localhost:5433" -ForegroundColor Cyan
Write-Host "Redis: localhost:6380" -ForegroundColor Cyan
Write-Host "Elasticsearch: http://localhost:9200" -ForegroundColor Cyan
Write-Host ""
Write-Host "View logs with: docker-compose logs -f" -ForegroundColor Yellow
Write-Host "View specific service: docker-compose logs -f frontend" -ForegroundColor Yellow
Write-Host "Stop with: docker-compose down" -ForegroundColor Yellow
