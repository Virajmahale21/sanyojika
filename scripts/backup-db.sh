#!/usr/bin/env bash
# AnumatiSetu — Automated Database Snapshot & Integrity Backup Utility
# Supports SQLite local development and PostgreSQL production environments

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "${BACKUP_DIR}"

echo "===================================================="
echo " Starting AnumatiSetu Database Backup: ${TIMESTAMP}"
echo "===================================================="

if [ -f "prisma/dev.db" ]; then
    BACKUP_FILE="${BACKUP_DIR}/anumatisetu_sqlite_${TIMESTAMP}.db"
    echo "Creating SQLite snapshot..."
    cp "prisma/dev.db" "${BACKUP_FILE}"
    
    # Generate SHA-256 integrity checksum
    sha256sum "${BACKUP_FILE}" > "${BACKUP_FILE}.sha256"
    echo "✔ Backup created: ${BACKUP_FILE}"
    echo "✔ Checksum written: ${BACKUP_FILE}.sha256"
elif [ -n "${DATABASE_URL:-}" ] && [[ "${DATABASE_URL}" =~ ^postgres ]]; then
    BACKUP_FILE="${BACKUP_DIR}/anumatisetu_pg_${TIMESTAMP}.sql.gz"
    echo "Exporting PostgreSQL dump..."
    pg_dump "${DATABASE_URL}" | gzip > "${BACKUP_FILE}"
    sha256sum "${BACKUP_FILE}" > "${BACKUP_FILE}.sha256"
    echo "✔ PostgreSQL backup created: ${BACKUP_FILE}"
else
    echo "✖ No active SQLite file or PostgreSQL connection found to backup."
    exit 1
fi

# Retention: keep latest 30 backups
find "${BACKUP_DIR}" -type f -name "anumatisetu_*" -mtime +30 -delete || true
echo "✔ Retention policy applied: cleaned snapshots older than 30 days."
