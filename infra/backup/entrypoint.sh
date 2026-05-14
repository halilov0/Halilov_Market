#!/bin/bash
# BACKUP_CRON: standard 5-field cron spec (default: 03:15 Asia/Jerusalem daily)
# BACKUP_RUN_ONCE=true: run backup.sh once and exit (handy for `docker compose run backup`)
set -euo pipefail

if [[ "${BACKUP_RUN_ONCE:-false}" == "true" ]]; then
    exec /usr/local/bin/backup.sh
fi

CRON_SPEC="${BACKUP_CRON:-15 3 * * *}"

# busybox crond strips env on fork. Snapshot the vars we need into a shell-safe
# wrapper so cron can re-source them. printf %q handles quoting for AWS secrets.
WRAPPER=/usr/local/bin/run-backup.sh
{
    echo "#!/bin/bash"
    echo "set -euo pipefail"
    for var in TZ PGHOST PGPORT PGUSER PGPASSWORD PGDATABASE \
               BACKUP_S3_ENDPOINT BACKUP_S3_BUCKET BACKUP_S3_PREFIX \
               BACKUP_S3_REGION BACKUP_RETENTION_DAYS \
               AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY; do
        if [[ -n "${!var:-}" ]]; then
            printf 'export %s=%q\n' "$var" "${!var}"
        fi
    done
    echo "exec /usr/local/bin/backup.sh"
} > "${WRAPPER}"
chmod +x "${WRAPPER}"

mkdir -p /etc/crontabs
echo "${CRON_SPEC} ${WRAPPER} >> /proc/1/fd/1 2>&1" > /etc/crontabs/root

echo "[entrypoint] starting crond with schedule: ${CRON_SPEC} (TZ=${TZ:-UTC})"
exec crond -f -l 8
