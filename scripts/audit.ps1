Write-Host "=== AUDITORIA ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backend Health:" -ForegroundColor Yellow
try {
    $h = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "  $($h.status)" -ForegroundColor Green
} catch { Write-Host "  ERROR" -ForegroundColor Red }

Write-Host ""
Write-Host "Frontend:" -ForegroundColor Yellow
try {
    $f = Invoke-WebRequest -Uri "http://localhost:80" -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($f.StatusCode)" -ForegroundColor Green
} catch { Write-Host "  ERROR" -ForegroundColor Red }

Write-Host ""
Write-Host "Flight Dashboard:" -ForegroundColor Yellow
try {
    $flights = Invoke-WebRequest -Uri "http://localhost:80/flights" -UseBasicParsing -TimeoutSec 5
    if ($flights.Content -match "Próximos vuelos") {
        Write-Host "  OK - Dashboard presente" -ForegroundColor Green
    } else {
        Write-Host "  Falta dashboard" -ForegroundColor Yellow
    }
} catch { Write-Host "  ERROR" -ForegroundColor Red }

Write-Host ""
Write-Host "Luggage Stats:" -ForegroundColor Yellow
try {
    $luggage = Invoke-WebRequest -Uri "http://localhost:80/luggage" -UseBasicParsing -TimeoutSec 5
    if ($luggage.Content -match "Total Reportes") {
        Write-Host "  OK - Stats presente" -ForegroundColor Green
    } else {
        Write-Host "  Falta stats" -ForegroundColor Yellow
    }
} catch { Write-Host "  ERROR" -ForegroundColor Red }

Write-Host ""
Write-Host "Navbar elementos:" -ForegroundColor Yellow
$home = Invoke-WebRequest -Uri "http://localhost:80" -UseBasicParsing -TimeoutSec 5
if ($home.Content -match "notification-bell") { Write-Host "  OK - Campana" -ForegroundColor Green }
if ($home.Content -match "user-info") { Write-Host "  OK - User info" -ForegroundColor Green }
if ($home.Content -match "strong") { Write-Host "  OK - Username con strong" -ForegroundColor Green }