# Fix WebSocket connection cho Vite HMR

## Cập nhật nginx config

```nginx
server {
  listen 443 ssl http2;
  server_name skillgapguide.engine.pro.vn;

  ssl_certificate     /etc/ssl/certs/skillgapguide_cf.crt;
  ssl_certificate_key /etc/ssl/private/skillgapguide_cf.key;

  # Frontend với WebSocket support
  location / {
    proxy_pass http://127.0.0.1:5173;
    proxy_http_version 1.1;                    # ✅ Bắt buộc cho WebSocket
    proxy_set_header Upgrade $http_upgrade;    # ✅ Forward upgrade header
    proxy_set_header Connection "upgrade";     # ✅ Set connection upgrade
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    
    # WebSocket timeout settings
    proxy_read_timeout 86400;                  # 24 hours
    proxy_send_timeout 86400;                  # 24 hours
  }

  # API routes
  location /api/ {
    proxy_pass http://14.225.36.166:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_read_timeout 3000s;
    proxy_send_timeout 3000s;
    proxy_connect_timeout 600s;
  }
}
```

## Các bước apply fix:

1. **Backup config hiện tại:**
   ```bash
   sudo cp /etc/nginx/sites-available/sgg /etc/nginx/sites-available/sgg.backup
   ```

2. **Cập nhật config:**
   ```bash
   sudo vim /etc/nginx/sites-available/sgg
   # Copy nội dung config mới vào
   ```

3. **Test config:**
   ```bash
   sudo nginx -t
   ```

4. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

5. **Verify:**
   ```bash
   # Check WebSocket connection trong browser console
   # Không còn lỗi "WebSocket connection failed"
   ```