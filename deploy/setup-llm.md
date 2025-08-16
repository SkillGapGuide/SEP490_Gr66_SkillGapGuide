Cài trên server gpu:
apt install -y tmux
curl https://ollama.ai/install.sh | sh
tmux new -s gpu
tmux a -t gpu

windows 1 mistral:
ollama serve

ollama pull mistral:7b-instruct-v0.3-q4_0
ollama run mistral:7b-instruct-v0.3-q4_0 (optional)
curl http://localhost:11434/api/generate -d '{"model": "mistral:7b-instruct-v0.3-q4_0", "prompt": "Xin chào!"}'
curl http://localhost:1234/api/generate -d '{"model": "mistral:7b-instruct-v0.3-q4_0", "prompt": "Xin chào!"}'



windows 2 embed:
cd /workspace/SEP490_Gr66_SkillGapGuide/sgg/src/main/java/com/skillgapguide/sgg/Controller/

# PyTorch GPU
pip install -U torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Phần còn lại
pip install -U fastapi "uvicorn[standard]" pydantic \
  sentence-transformers transformers accelerate \
  huggingface-hub safetensors sentencepiece \
  numpy scipy scikit-learn einops

pip install fastapi "uvicorn[standard]" pydantic sentence-transformers torch transformers

python EmbeddingBGEM3.py


forward port
ssh -p 19745 -L 1234:localhost:11434 root@213.173.108.204
curl http://localhost:1234/api/generate -d '{"model": "mistral:7b-instruct-v0.3-q4_0", "prompt": "Xin chào!"}'
curl -X POST http://127.0.0.1:8000/embed_nomicv1.5 \
  -H "Content-Type: application/json" \
  -d '{"text":"hello world"}'

curl -X POST http://127.0.0.1:8000/embed_nomicv2 \
  -H "Content-Type: application/json" \
  -d '{"text":"xin chào"}'



curl -X POST http://127.0.0.1:8000/embed_nomicv1.5 -H "Content-Type:                  │
│   application/json" -d '{"text": "test"}'  


14.225.36.166
curl -X POST http://14.225.36.166:8000/embed_nomicv1.5 \
  -H "Content-Type: application/json" \
  -d '{"text":"hello world"}'


check thông số cpu, ram, disk, gpu:
lscpu
free -h
df -h
nvidia-smi



ssh -p 19517 -L 0.0.0.0:8000:localhost:8000 root@213.173.108.204



















thừa:
sudo apt update
sudo apt install -y python3 python3-pip

pip install huggingface_hub
huggingface-cli login
Add token as git credential? (Y/n): chọn n


mkdir -p ~/mistral_models/7B-Instruct-v0.3
tải về model tốn 30p: huggingface-cli download mistralai/Mistral-7B-Instruct-v0.3 --include "params.json" "consolidated.safetensors" "tokenizer.model.v3" --local-dir ~/mistral_models/7B-Instruct-v0.3

ls -l ~/mistral_models/7B-Instruct-v0.3


cd /opt
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
mkdir build

cd build
apt install -y cmake libcurl4-openssl-dev
cmake --version
cmake ..
make -j$(nproc) (chờ 5 phút)
cd ..
sudo apt install -y python3.10-venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip3 install numpy transformers torch (thừa)

cd /opt/llama.cpp
python3 convert_hf_to_gguf.py ~/mistral_models/7B-Instruct-v0.3   --outfile ~/mistral_models/7B-Instruct-v0.3/mistral-7b-instruct-v0.3.gguf   --mistral-format
cd /opt/llama.cpp/build/bin
./llama-server \
  -m ~/mistral_models/7B-Instruct-v0.3/mistral-7b-instruct-v0.3.gguf \
  --port 1234 \
  --host 0.0.0.0 \
  -t 4 \
  -c 2048 \
  --chat-template mistral-v3 \
  --override-kv llama.context_length=int:32768


curl -X POST http://localhost:1234/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Xin chào, bạn khỏe không?", "max_tokens": 50}'



ls /root/mistral_models/7B-Instruct-v0.3/mistral-7b-instruct-v0.3.gguf

swap space để đủ 16GB thì mới convert được model mistral-7b-instruct-v0.3.gguf
sudo fallocate -l 16G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
kiểm tra
swapon --show
free -h




sudo apt install nginx -y
sudo vim /etc/nginx/sites-available/sgg
server {
    listen 80;
    server_name skillgapguide.engine.pro.vn;
    return 301 https://$host$request_uri;
}
server {
  listen 443 ssl http2;
  server_name skillgapguide.engine.pro.vn;

  # dùng cert (CF Origin / Let's Encrypt) – như bạn đã chọn
  ssl_certificate     /etc/ssl/certs/skillgapguide_cf.crt;
  ssl_certificate_key /etc/ssl/private/skillgapguide_cf.key;

  location / {
    proxy_pass http://127.0.0.1:5173;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }

  # API
  location /api/ {
    proxy_pass http://14.225.36.166:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }
}


sudo vim /etc/ssl/certs/skillgapguide_cf.crt
-----BEGIN CERTIFICATE-----
xxx
-----END CERTIFICATE-----



sudo vim /etc/ssl/private/skillgapguide_cf.key
-----BEGIN PRIVATE KEY-----
xxx
-----END PRIVATE KEY-----

sudo ln -s /etc/nginx/sites-available/sgg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
journalctl -u nginx.service