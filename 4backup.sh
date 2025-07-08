#!/bin/bash

# Script to backup data from Docker Compose services and copy to local machine or Google Drive
# Ensure this script has executable permissions: chmod +x backup.sh

# Exit on any error
set -e

# Source environment variables (create a .env file with your secrets)
if [ -f .env ]; then
    source .env
fi

# Define backup directory
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"
BACKUP_FILE="${BACKUP_PATH}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_PATH}"

# Backup PostgreSQL database
echo "Backing up PostgreSQL database..."
docker exec tazav1-postgres pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" --no-owner --no-privileges > "${BACKUP_PATH}/postgres_backup_${TIMESTAMP}.sql"

# Backup Redis data (corrected - Redis SAVE doesn't take a path parameter)
echo "Backing up Redis data..."
docker exec tazav1-redis redis-cli --pass "${REDIS_PASSWORD}" SAVE
docker cp tazav1-redis:/data/dump.rdb "${BACKUP_PATH}/redis_backup_${TIMESTAMP}.rdb"

# Backup MinIO data
echo "Backing up MinIO data..."
docker cp tazav1-minio:/data "${BACKUP_PATH}/minio_data"

# Backup API logs
echo "Backing up API logs..."
docker cp tazav1-api:/app/logs "${BACKUP_PATH}/api_logs"

# Compress backups
echo "Compressing backups..."
tar -czf "${BACKUP_FILE}" -C "${BACKUP_DIR}" "backup_${TIMESTAMP}"

# Clean up uncompressed backup files
rm -rf "${BACKUP_PATH}"

# Remove backups older than 7 days
echo "Cleaning up old backups..."
find "${BACKUP_DIR}" -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}"

# Option 1: Copy to Local Machine using rsync (only if variables are set)
if [ -n "${LOCAL_MACHINE_USER}" ] && [ -n "${LOCAL_MACHINE_IP}" ] && [ -n "${LOCAL_DEST_DIR}" ]; then
    echo "Copying backup to local machine..."
    rsync -avz --progress -e "ssh -o StrictHostKeyChecking=no" "${BACKUP_FILE}" "${LOCAL_MACHINE_USER}@${LOCAL_MACHINE_IP}:${LOCAL_DEST_DIR}"
fi

# Option 2: Upload to Google Drive using gdrive (only if folder ID is set)
if [ -n "${GDRIVE_FOLDER_ID}" ] && command -v gdrive >/dev/null 2>&1; then
    echo "Uploading backup to Google Drive..."
    gdrive upload --parent "${GDRIVE_FOLDER_ID}" "${BACKUP_FILE}"
fi

echo "Backup process completed!"
