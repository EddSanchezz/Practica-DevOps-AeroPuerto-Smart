Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  FlyTrack - Servicios iniciados" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$backendOk = "[OK]"
$frontendOk = "[OK]"
$dbOk = "[OK]"

try {
    Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 3 | Out-Null
    $backendOk = "[OK]"
} catch { $backendOk = "[FAIL]" }

try {
    Invoke-WebRequest -Uri "http://localhost:80" -UseBasicParsing -TimeoutSec 3 | Out-Null
    $frontendOk = "[OK]"
} catch { $frontendOk = "[FAIL]" }

$dbContainer = docker ps --filter "name=flytrack-db" --format "{{.Names}}"
if ($dbContainer -notmatch "flytrack-db") {
    $dbOk = "[FAIL]"
}

Write-Host "  Frontend (nginx)  : http://localhost:80      " -NoNewline
if ($frontendOk -eq "[OK]") { Write-Host $frontendOk -ForegroundColor Green } else { Write-Host $frontendOk -ForegroundColor Red }

Write-Host "  Backend (FastAPI): http://localhost:8000   " -NoNewline
if ($backendOk -eq "[OK]") { Write-Host $backendOk -ForegroundColor Green } else { Write-Host $backendOk -ForegroundColor Red }

Write-Host "  Swagger UI        : http://localhost:8000/docs" -NoNewline
if ($backendOk -eq "[OK]") { Write-Host $backendOk -ForegroundColor Green } else { Write-Host $backendOk -ForegroundColor Red }

Write-Host "  PostgreSQL        : localhost:5432           " -NoNewline
if ($dbOk -eq "[OK]") { Write-Host $dbOk -ForegroundColor Green } else { Write-Host $dbOk -ForegroundColor Red }

Write-Host ""

$flights = "0"
$users = "0"
$luggage = "0"

try {
    $fresult = docker exec flytrack-db psql -U flytrack -d flytrack -t -c "SELECT COUNT(*) FROM flights;" 2>$null
    if ($fresult) { $flights = ($fresult.Trim() -replace '\D','') }
    if (-not $flights) { $flights = "0" }
} catch { $flights = "0" }

try {
    $uresult = docker exec flytrack-db psql -U flytrack -d flytrack -t -c "SELECT COUNT(*) FROM users;" 2>$null
    if ($uresult) { $users = ($uresult.Trim() -replace '\D','') }
    if (-not $users) { $users = "0" }
} catch { $users = "0" }

try {
    $lresult = docker exec flytrack-db psql -U flytrack -d flytrack -t -c "SELECT COUNT(*) FROM luggage_reports;" 2>$null
    if ($lresult) { $luggage = ($lresult.Trim() -replace '\D','') }
    if (-not $luggage) { $luggage = "0" }
} catch { $luggage = "0" }

Write-Host "  Base de datos:" -ForegroundColor Yellow
Write-Host "    - Vuelos: " -NoNewline; Write-Host $flights -ForegroundColor Green
Write-Host "    - Usuarios: " -NoNewline; Write-Host $users -ForegroundColor Green
Write-Host "    - Equipajes: " -NoNewline; Write-Host $luggage -ForegroundColor Green

Write-Host ""
Write-Host "  Para ver logs: task logs:all" -ForegroundColor Gray
Write-Host "  Para detener:  task docker:down" -ForegroundColor Gray
Write-Host ""