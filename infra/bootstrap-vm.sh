#!/bin/bash
# Bootstrap an Oracle Cloud Always Free VM (ARM Ampere A1 or x86 micro) for
# running the Halilov Online stack. Run once on a fresh Ubuntu 22.04 or
# Oracle Linux 8/9 instance, as the default user (opc on OL, ubuntu on Ubuntu).
#
#   curl -fsSL https://raw.githubusercontent.com/<you>/Halilov_Online/main/infra/bootstrap-vm.sh | bash
# or
#   scp infra/bootstrap-vm.sh user@vm:/tmp/ && ssh user@vm 'bash /tmp/bootstrap-vm.sh'
#
# ─────────────── OCI dashboard steps you still need to do ───────────────
# 1. Create instance:  Compute → Instances → Create Instance
#       Shape: VM.Standard.A1.Flex (Always Free) — 2 OCPU / 12 GB RAM is plenty.
#       Image: Canonical Ubuntu 22.04 (recommended) OR Oracle Linux 9.
#       Networking: keep default VCN, assign public IPv4.
#       SSH: paste your public key.
# 2. Open ingress in the VCN security list:
#       Networking → Virtual Cloud Networks → <your VCN> → Security Lists → Default
#       Add ingress rules: source 0.0.0.0/0, TCP destination port 80 and 443.
#       (Port 22 from your IP is already open by default.)
# 3. SSH in and run this script.
# 4. Log out and back in (docker group change needs a new session).
# 5. Clone the repo, copy infra/.env.example → infra/.env, fill in values, then:
#       docker compose -f infra/docker-compose.prod.yml up -d --build

set -euo pipefail

if [[ $EUID -eq 0 ]]; then
    echo "Run as the regular user (opc/ubuntu), not root. sudo is used where needed." >&2
    exit 1
fi

. /etc/os-release
echo "[bootstrap] detected ${PRETTY_NAME}"

# ── Docker Engine + compose plugin ──
if ! command -v docker >/dev/null 2>&1; then
    echo "[bootstrap] installing Docker via official convenience script"
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sudo sh /tmp/get-docker.sh
    rm -f /tmp/get-docker.sh
else
    echo "[bootstrap] docker already present: $(docker --version)"
fi

sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

# ── Host firewall: open 80 + 443 ──
case "${ID}" in
    ubuntu|debian)
        # Oracle's Ubuntu image ships iptables rules that DROP traffic except on 22.
        # Insert ACCEPT rules above the REJECT lines and persist them.
        echo "[bootstrap] opening 80/443 via iptables (Ubuntu OCI image)"
        sudo iptables -I INPUT 6 -p tcp --dport 80  -j ACCEPT
        sudo iptables -I INPUT 6 -p tcp --dport 443 -j ACCEPT
        if ! dpkg -s iptables-persistent >/dev/null 2>&1; then
            echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
            echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections
            sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
            sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq iptables-persistent
        fi
        sudo netfilter-persistent save
        ;;
    ol|rhel|almalinux|rocky)
        echo "[bootstrap] opening 80/443 via firewalld (Oracle/RHEL family)"
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --permanent --add-service=https
        sudo firewall-cmd --reload
        ;;
    *)
        echo "[bootstrap] WARNING: unknown distro ${ID} — open 80/443 manually" >&2
        ;;
esac

# ── git (handy for cloning the repo) ──
if ! command -v git >/dev/null 2>&1; then
    case "${ID}" in
        ubuntu|debian) sudo apt-get install -y -qq git ;;
        ol|rhel|almalinux|rocky) sudo dnf install -y -q git ;;
    esac
fi

echo
echo "[bootstrap] done. Log out and back in so the docker group takes effect, then:"
echo "    git clone <your-repo-url> halilov && cd halilov"
echo "    cp infra/.env.example infra/.env && \$EDITOR infra/.env"
echo "    docker compose -f infra/docker-compose.prod.yml up -d --build"
