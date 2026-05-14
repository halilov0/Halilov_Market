#!/bin/bash
# Idempotent product seeder. Reads a JSON catalog file, uploads each image to
# the admin media endpoint, then creates the product row. Skips SKUs that
# already exist (HTTP 409) instead of aborting, so it is safe to re-run.
#
# Usage:
#   HALILOV_BASE_URL=http://158.180.49.247 \
#   HALILOV_ADMIN_EMAIL=admin@halilov.local \
#   HALILOV_ADMIN_PASSWORD='...' \
#   bash infra/seed/seed-products.sh infra/seed/bags-luggage.json
#
# If you keep credentials in infra/.env locally, source it first:
#   set -a; . infra/.env; set +a
#   bash infra/seed/seed-products.sh infra/seed/bags-luggage.json
# (infra/.env uses POSTGRES_* / INIT_ADMIN_* — map them in the calling shell.)
set -euo pipefail

DATA_FILE="${1:-}"
[ -z "$DATA_FILE" ] && { echo "usage: $0 <catalog.json>"; exit 2; }
[ ! -f "$DATA_FILE" ] && { echo "no such file: $DATA_FILE"; exit 2; }

: "${HALILOV_BASE_URL:?set HALILOV_BASE_URL (e.g. http://158.180.49.247)}"
: "${HALILOV_ADMIN_EMAIL:?set HALILOV_ADMIN_EMAIL}"
: "${HALILOV_ADMIN_PASSWORD:?set HALILOV_ADMIN_PASSWORD}"

BASE="$HALILOV_BASE_URL"
DATA_DIR=$(dirname "$DATA_FILE")
PYTHON=""
for cand in python python3; do
    if command -v "$cand" >/dev/null 2>&1 && "$cand" -c 'import json' >/dev/null 2>&1; then
        PYTHON="$cand"; break
    fi
done
[ -z "$PYTHON" ] && { echo "python required for JSON handling"; exit 2; }
export PYTHONIOENCODING=utf-8  # Windows defaults to cp1252 which can't print Hebrew

# ---- login ----
echo "[auth] logging in as $HALILOV_ADMIN_EMAIL"
TOKEN=$(curl -sS -X POST "$BASE/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d "$($PYTHON -c "import json,os;print(json.dumps({'email':os.environ['HALILOV_ADMIN_EMAIL'],'password':os.environ['HALILOV_ADMIN_PASSWORD']}))")" \
    | "$PYTHON" -c 'import sys,json;d=json.load(sys.stdin);print(d.get("token",""))')
[ -z "$TOKEN" ] && { echo "login failed"; exit 1; }

# ---- ensure category ----
CAT_SLUG=$("$PYTHON" -c "import json;d=json.load(open('$DATA_FILE',encoding='utf-8'));print(d['category']['slug'])")
CAT_NAME=$("$PYTHON" -c "import json;d=json.load(open('$DATA_FILE',encoding='utf-8'));print(d['category']['nameHe'])")
CAT_SORT=$("$PYTHON" -c "import json;d=json.load(open('$DATA_FILE',encoding='utf-8'));print(d['category'].get('sortOrder',99))")

EXISTING_CAT_ID=$(curl -sS "$BASE/api/categories" \
    | "$PYTHON" -c "import sys,json;cs=json.load(sys.stdin);
m=[c for c in cs if c['slug']=='$CAT_SLUG']
print(m[0]['id'] if m else '')")

if [ -n "$EXISTING_CAT_ID" ]; then
    CATEGORY_ID="$EXISTING_CAT_ID"
    echo "[cat ] reuse '$CAT_SLUG' (id=$CATEGORY_ID)"
else
    BODY=$("$PYTHON" -c "import json;print(json.dumps({'slug':'$CAT_SLUG','nameHe':'$CAT_NAME','parentId':None,'sortOrder':$CAT_SORT}))")
    CREATED=$(curl -sS -X POST "$BASE/api/admin/catalog/categories" \
        -H "Authorization: Bearer $TOKEN" \
        -H 'Content-Type: application/json' \
        -d "$BODY")
    CATEGORY_ID=$(echo "$CREATED" | "$PYTHON" -c 'import sys,json;print(json.load(sys.stdin).get("id",""))')
    [ -z "$CATEGORY_ID" ] && { echo "category create failed: $CREATED"; exit 1; }
    echo "[cat ] created '$CAT_SLUG' (id=$CATEGORY_ID)"
fi

# ---- per product ----
IMG_DIR_REL=$("$PYTHON" -c "import json;print(json.load(open('$DATA_FILE',encoding='utf-8')).get('imageDir',''))")
IMG_DIR="$DATA_DIR/$IMG_DIR_REL"
[ -n "$IMG_DIR_REL" ] && [ ! -d "$IMG_DIR" ] && IMG_DIR="$IMG_DIR_REL"  # fall back to cwd-relative

CREATED=0; SKIPPED=0; FAILED=0
N=$("$PYTHON" -c "import json;print(len(json.load(open('$DATA_FILE',encoding='utf-8'))['products']))")
echo "[seed] $N products from $DATA_FILE"

for i in $(seq 0 $((N - 1))); do
    PROD_JSON=$("$PYTHON" -c "import json;p=json.load(open('$DATA_FILE',encoding='utf-8'))['products'][$i];print(json.dumps(p,ensure_ascii=False))")
    SKU=$(echo "$PROD_JSON" | "$PYTHON" -c 'import sys,json;print(json.load(sys.stdin)["sku"])')
    FNAME=$(echo "$PROD_JSON" | "$PYTHON" -c 'import sys,json;print(json.load(sys.stdin)["file"])')
    IMG_PATH="$IMG_DIR/$FNAME"

    if [ ! -f "$IMG_PATH" ]; then
        echo "  [skip] $SKU — image not found: $IMG_PATH"
        FAILED=$((FAILED + 1))
        continue
    fi

    # Upload image (deterministically per row: the backend writes a uuid, so
    # re-running uploads a fresh file. That's fine — duplicates are cheap and
    # the row creation below is what really decides whether we add a product.)
    UPLOAD_JSON=$(curl -sS -X POST "$BASE/api/admin/media/products" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$IMG_PATH;type=image/jpeg")
    IMG_URL=$(echo "$UPLOAD_JSON" | "$PYTHON" -c 'import sys,json;print(json.load(sys.stdin).get("url",""))')
    if [ -z "$IMG_URL" ]; then
        echo "  [fail] $SKU — upload failed: $UPLOAD_JSON"
        FAILED=$((FAILED + 1))
        continue
    fi

    BODY=$(echo "$PROD_JSON" | CATEGORY_ID="$CATEGORY_ID" IMG_URL="$IMG_URL" "$PYTHON" -c '
import sys, json, os
p = json.load(sys.stdin)
out = {
    "sku": p["sku"],
    "slug": p["slug"],
    "nameHe": p["nameHe"],
    "descriptionHe": p.get("descriptionHe", ""),
    "categoryId": int(os.environ["CATEGORY_ID"]),
    "priceAgorot": p["priceAgorot"],
    "stockQty": p.get("stockQty", 0),
    "imageUrl": os.environ["IMG_URL"],
    "active": p.get("active", True),
}
# ensure_ascii=True: escape non-ASCII to \uXXXX so the body survives shell
# variable round-trip on Windows Git Bash without locale-encoding loss.
print(json.dumps(out))
')

    HTTP=$(curl -sS -o /tmp/seed-resp.$$ -w '%{http_code}' -X POST "$BASE/api/admin/catalog/products" \
        -H "Authorization: Bearer $TOKEN" \
        -H 'Content-Type: application/json' \
        --data-binary "$BODY")
    case "$HTTP" in
        201) echo "  [ ok ] $SKU"; CREATED=$((CREATED + 1)) ;;
        409) echo "  [skip] $SKU — already exists"; SKIPPED=$((SKIPPED + 1)) ;;
        *)   echo "  [fail] $SKU — HTTP $HTTP: $(cat /tmp/seed-resp.$$)"; FAILED=$((FAILED + 1)) ;;
    esac
    rm -f /tmp/seed-resp.$$
done

echo "[done] created=$CREATED skipped=$SKIPPED failed=$FAILED"
[ "$FAILED" -gt 0 ] && exit 1 || exit 0
