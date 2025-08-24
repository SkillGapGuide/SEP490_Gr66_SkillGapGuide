import hmac, hashlib, os, asyncio, subprocess, logging
from fastapi import FastAPI, Request, Response
from config import Config
import uvicorn



logging.basicConfig(level=logging.INFO)

app = FastAPI()
config = Config()


@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_body = await request.body()
    curl_command = f"curl -X {request.method} '{request.url}'"
    
    # Add headers to curl command
    for header, value in request.headers.items():
        curl_command += f" -H '{header}: {value}'"
    
    # Add request body if it's a POST or PUT request
    if request.method in ["POST", "PUT"]:
        curl_command += f" -d '{request_body.decode()}'"
    
    logging.info(f"Request: {curl_command}")
    
    response = await call_next(request)
    return response

def verify_signature(raw: bytes, sig_header: str | None) -> bool:
    if not sig_header or not sig_header.startswith("sha256="):
        return False
    digest = "sha256=" + hmac.new(
        config.WEBHOOK_SECRET.encode(), raw, hashlib.sha256
    ).hexdigest()
    try:
        return hmac.compare_digest(digest, sig_header)
    except Exception:
        # fallback timing-safe
        return digest == sig_header

def run_deploy() -> tuple[int, str]:
    cmd = f"""
        set -e
        cd {config.REPO_PATH}
        git pull
        systemctl restart be-service
    """
    completed = subprocess.run(
        ["/bin/bash", "-lc", cmd],
        capture_output=True,
        text=True
    )
    code = completed.returncode
    out = (completed.stdout or "") + (completed.stderr or "")
    return code, out

@app.post("/github-webhook")
async def github_webhook(request: Request):
    raw = await request.body()
    sig = request.headers.get("x-hub-signature-256")
    event = request.headers.get("x-github-event", "")

    if not verify_signature(raw, sig):
        return Response("Invalid signature", status_code=401)
    
    # GitHub gửi data dưới dạng form-urlencoded với key 'payload'
    import urllib.parse
    import json
    
    body_str = raw.decode('utf-8')
    parsed_data = urllib.parse.parse_qs(body_str)
    payload_str = parsed_data.get("payload", [None])[0]
    
    if not payload_str:
        return Response("No payload found", status_code=400)
    
    payload = json.loads(payload_str)
    
    if event == "push" and payload.get("ref") == f"refs/heads/{config.BRANCH}":
        async with config.LOCK:
            code, out = await asyncio.get_event_loop().run_in_executor(None, run_deploy)
            return {"status": "ok" if code == 0 else "failed", "code": code, "log": out[-4000:]}  # trả tối đa 4000 ký tự log
    else:
        return {"status": "ignored", "reason": "not a push event in the correct branch"}

if __name__ == "__main__":
    uvicorn.run(app, host=config.API_HOST, port=config.API_PORT)
