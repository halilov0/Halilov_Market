#!/bin/bash
# Dump postgres → gzip → upload to S3-compatible bucket → prune old backups.
# Env (all required unless noted):
#   PGHOST, PGPORT (default 5432), PGUSER, PGPASSWORD, PGDATABASE
#   BACKUP_S3_ENDPOINT          e.g. https://<acct>.r2.cloudflarestorage.com
#   BACKUP_S3_BUCKET            target bucket
#   BACKUP_S3_PREFIX            key prefix, e.g. halilov/postgres (no leading/trailing slash)
#   BACKUP_S3_REGION            optional, defaults to "auto" (R2)
#   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY  S3 creds (read by aws-cli)
#   BACKUP_RETENTION_DAYS       optional, defaults to 14
set -euo pipefail

: "${PGHOST:?PGHOST required}"
: "${PGUSER:?PGUSER required}"
: "${PGPASSWORD:?PGPASSWORD required}"
: "${PGDATABASE:?PGDATABASE required}"
: "${BACKUP_S3_ENDPOINT:?BACKUP_S3_ENDPOINT required}"
: "${BACKUP_S3_BUCKET:?BACKUP_S3_BUCKET required}"
: "${BACKUP_S3_PREFIX:?BACKUP_S3_PREFIX required}"
: "${AWS_ACCESS_KEY_ID:?AWS_ACCESS_KEY_ID required}"
: "${AWS_SECRET_ACCESS_KEY:?AWS_SECRET_ACCESS_KEY required}"

export PGPORT="${PGPORT:-5432}"
export AWS_DEFAULT_REGION="${BACKUP_S3_REGION:-auto}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="halilov-${STAMP}.sql.gz"
TMP="/tmp/${FILE}"
KEY="${BACKUP_S3_PREFIX}/${FILE}"

echo "[backup $(date -Iseconds)] dumping ${PGDATABASE}@${PGHOST}:${PGPORT}"
pg_dump --format=plain --no-owner --no-privileges --clean --if-exists \
    | gzip -9 > "${TMP}"

SIZE=$(stat -c%s "${TMP}" 2>/dev/null || stat -f%z "${TMP}")
echo "[backup] dump size ${SIZE} bytes — uploading to s3://${BACKUP_S3_BUCKET}/${KEY}"
aws s3 cp "${TMP}" "s3://${BACKUP_S3_BUCKET}/${KEY}" \
    --endpoint-url "${BACKUP_S3_ENDPOINT}" \
    --only-show-errors

rm -f "${TMP}"

echo "[backup] pruning objects older than ${RETENTION_DAYS} days"
# BusyBox date has no relative-time arithmetic, so compute the cutoff via epoch.
CUTOFF_EPOCH=$(( $(date -u +%s) - RETENTION_DAYS * 86400 ))
CUTOFF=$(date -u -d "@${CUTOFF_EPOCH}" +%Y%m%d)

aws s3 ls "s3://${BACKUP_S3_BUCKET}/${BACKUP_S3_PREFIX}/" \
    --endpoint-url "${BACKUP_S3_ENDPOINT}" \
    | awk '{print $NF}' \
    | while read -r name; do
        [[ -z "${name}" ]] && continue
        # name = halilov-YYYYMMDDTHHMMSSZ.sql.gz
        date_part=$(echo "${name}" | sed -nE 's/^halilov-([0-9]{8})T.*$/\1/p')
        [[ -z "${date_part}" ]] && continue
        if [[ "${date_part}" < "${CUTOFF}" ]]; then
            echo "[backup]   delete ${name}"
            aws s3 rm "s3://${BACKUP_S3_BUCKET}/${BACKUP_S3_PREFIX}/${name}" \
                --endpoint-url "${BACKUP_S3_ENDPOINT}" \
                --only-show-errors
        fi
      done

echo "[backup $(date -Iseconds)] done"
