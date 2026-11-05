# AnumatiSetu — Automated Database Snapshot & Integrity Backup Utility (PowerShell)
param(
    [string]$BackupDir = ".\backups"
)

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Starting AnumatiSetu Database Backup: $Timestamp" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$SqlitePath = "prisma\dev.db"
if (Test-Path $SqlitePath) {
    $BackupFile = Join-Path $BackupDir "anumatisetu_sqlite_${Timestamp}.db"
    Copy-Item $SqlitePath $BackupFile
    
    $Hash = (Get-FileHash -Path $BackupFile -Algorithm SHA256).Hash
    Set-Content -Path "${BackupFile}.sha256" -Value "$Hash *$BackupFile"
    
    Write-Host "✔ Backup created: $BackupFile" -ForegroundColor Green
    Write-Host "✔ SHA-256 Checksum: $Hash" -ForegroundColor Green
} else {
    Write-Host "✖ No active SQLite file found at $SqlitePath" -ForegroundColor Red
    exit 1
}
