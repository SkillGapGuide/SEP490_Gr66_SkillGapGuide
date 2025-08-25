cat > /workspace/setup-create-pod.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

# ===== Config =====
WORKDIR="/workspace"
REPO_DIR="${WORKDIR}/SEP490_Gr66_SkillGapGuide"
VENV_DIR="${WORKDIR}/venv"
OLLAMA_MODELS_DIR="${WORKDIR}/ollama"

echo "[1/7] Ensure work directories..."
mkdir -p "$WORKDIR" "$OLLAMA_MODELS_DIR"

echo "[2/7] Install curl if missing..."
if ! command -v curl >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -y
    sudo apt-get install -y curl
  else
    echo "curl not found and apt-get unavailable. Please install curl manually." >&2
    exit 1
  fi
fi

echo "[3/7] Install Ollama..."
OLLAMA_DIR="/workspace/ollama"

# Nếu đã tồn tại binary ollama thì bỏ qua
if [ -x "$OLLAMA_DIR/bin/ollama" ]; then
  echo "Ollama already installed in $OLLAMA_DIR. Skipping installation."
else
  echo "Ollama not found in $OLLAMA_DIR. Installing..."
  
  # Tạo thư mục chứa Ollama trong /workspace
  mkdir -p "$OLLAMA_DIR"
  cd "$OLLAMA_DIR"

  # Tải script cài đặt về
  curl -fsSL https://ollama.ai/install.sh -o install.sh
  
  # Chỉnh sửa biến cài đặt để trỏ vào /workspace/ollama
  sed -i "s|/usr/local|$OLLAMA_DIR|g" install.sh

  # Chạy cài đặt
  sh install.sh
fi

# Tạo symlink để dùng ở mọi nơi
if ! command -v ollama >/dev/null 2>&1; then
  ln -sf "$OLLAMA_DIR/bin/ollama" /usr/local/bin/ollama
fi

echo "Ollama installation completed."


# Persist models under /workspace
export OLLAMA_MODELS="${OLLAMA_MODELS_DIR}"
if ! grep -q "OLLAMA_MODELS=" /etc/environment 2>/dev/null; then
  echo "OLLAMA_MODELS=${OLLAMA_MODELS_DIR}" | tee -a /etc/environment >/dev/null || true
fi

ollama serve > "${WORKDIR}/ollama_setup.log" 2>&1 &
OLLAMA_PID=$!
sleep 2
echo "Ollama serve started in background (PID $OLLAMA_PID)"

echo "[4/7] Check and pull model mistral:7b-instruct-v0.3-q4_0..."
if ollama list | grep -q "^mistral:7b-instruct-v0.3-q4_0"; then
  echo "Model mistral:7b-instruct-v0.3-q4_0 already exists. Skipping pull."
else
  OLLAMA_MODELS="${OLLAMA_MODELS_DIR}" ollama pull mistral:7b-instruct-v0.3-q4_0
fi

echo "[5/7] Ensure Python + pip + venv..."
if ! command -v python3 >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y python3 python3-venv python3-pip
else
  # Some minimal images have python3 but no pip
  if ! command -v pip3 >/dev/null 2>&1; then
    sudo apt-get update -y
    sudo apt-get install -y python3-pip
  fi
fi

echo "[6/7] Clone/update repo and install Python deps..."
cd "${WORKDIR}"

if [ -d "${REPO_DIR}/.git" ]; then
  echo "Repo exists. Updating..."
  cd "${REPO_DIR}"
  git fetch --all --prune
  git checkout dev
  git pull --ff-only
else
  echo "Cloning repo..."
  # If your pod doesn't have SSH key or GitHub access via SSH, switch to HTTPS:
  REPO_HTTPS="https://github.com/HaiTranThanh203/SEP490_Gr66_SkillGapGuide.git"
  git clone "${REPO_HTTPS}"
  cd "${REPO_DIR}"
  git checkout dev
fi
EOF



echo "[7/7] Install Python deps..."
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env

cd /workspace/SEP490_Gr66_SkillGapGuide/sgg/src/main/java/com/skillgapguide/sgg/Controller/
pip install torch==2.4.1+cu124 torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

uv run EmbeddingBGEM3.py



echo "Done. ✅"


EOF

<!-- echo "Installing Python packages into venv..."
pip install --upgrade \
  --index-url https://download.pytorch.org/whl/cu124 \
  --extra-index-url https://pypi.org/simple \
  torch==2.4.1+cu124 torchvision==0.19.1+cu124 torchaudio==2.4.1+cu124 -->

<!-- pip install \
  fastapi==0.115.0 \
  "uvicorn[standard]==0.30.1" \
  pydantic==2.9.2 \
  sentence-transformers==3.0.1 \
  transformers==4.44.2 \
  einops -->

cd /workspace
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
uv venv
source .venv/bin/activate
cd /workspace/SEP490_Gr66_SkillGapGuide/sgg/src/main/java/com/skillgapguide/sgg/Controller
# Chạy app ngay lập tức (tạo & tái dùng venv/cache tự động)
uv run \
  --with "fastapi==0.115.0" \
  --with "uvicorn[standard]==0.30.1" \
  --with "pydantic==2.9.2" \
  --with "sentence-transformers==3.0.1" \
  --with "transformers==4.44.2" \
  --with "einops" \
  --with "torch==2.4.1" 

uv run python EmbeddingBGEM3.py
cat > /workspace/SEP490_Gr66_SkillGapGuide/sgg/src/main/java/com/skillgapguide/sgg/Controller/pyproject.toml <<'EOF'
[project]
name = "skillgap-embedding-api"
version = "0.1.0"
description = "FastAPI service for embeddings with sentence-transformers"
requires-python = ">=3.10"
dependencies = [
    "fastapi==0.115.0",
    "uvicorn[standard]==0.30.1",
    "pydantic==2.9.2",
    "sentence-transformers==3.0.1",
    "transformers==4.44.2",
    "einops",
    "torch==2.4.1",
]
EOF
uv pip install .
uv run python EmbeddingBGEM3.py

<!-- uv run \
--with "fastapi==0.115.0" \
--with "uvicorn[standard]==0.30.1" \
--with "pydantic==2.9.2" \
--with "sentence-transformers==3.0.1" \
--with "transformers==4.44.2" \
--with "einops" \
--with "torch==2.4.1+cu124" --index-url https://download.pytorch.org/whl/cu124 -->


echo "Done. ✅"
EOF
chmod +x /workspace/setup-create-pod.sh
bash /workspace/setup-create-pod.sh




cat > /workspace/run-python-service.sh <<'EOF'

#!/usr/bin/env bash
set -euo pipefail

WORKDIR="/workspace"
REPO_DIR="${WORKDIR}/SEP490_Gr66_SkillGapGuide"
VENV_DIR="${WORKDIR}/venv"
OLLAMA_MODELS_DIR="${WORKDIR}/ollama"
SESSION_NAME="ollama"

# Activate venv
if [ -f "${VENV_DIR}/bin/activate" ]; then
  # shellcheck disable=SC1091
  source "${VENV_DIR}/bin/activate"
else
  echo "Python venv not found at ${VENV_DIR}. Please run bash /workspace/run-python-service.sh first." >&2
  exit 1
fi

# 1) Run your embedding script
echo "[1/3] Running EmbeddingBGEM3.py..."
cd /workspace/SEP490_Gr66_SkillGapGuide/sgg/src/main/java/com/skillgapguide/sgg/Controller/
python EmbeddingBGEM3.py
EOF
chmod +x /workspace/run-python-service.sh
bash /workspace/run-python-service.sh

ssh root@14.225.36.166 -A
ssh root@213.173.108.37 -p 15136 -i ~/.ssh/id_ed25519

ssh -i ~/.ssh/id_ed25519 -p 15136 \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -L 0.0.0.0:8000:localhost:8000 \
  -L 0.0.0.0:1234:localhost:11434 \
  root@213.173.108.37


