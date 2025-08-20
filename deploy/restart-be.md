1. Tạo file service /etc/systemd/system/be-service.service với cấu hình:
    - Chạy lệnh ./mvnw spring-boot:run trong thư mục /opt/SEP490_Gr66_SkillGapGuide/sgg
    - Log output vào /var/log/be-service.log
    - Log error vào /var/log/be-service-error.log
    - Tự động restart khi crash
  2. Cập nhật hàm run_deploy trong /opt/SEP490_Gr66_SkillGapGuide/deploy/app.py để thêm lệnh systemctl restart be-service

  - systemctl start be-service
  - systemctl restart be-service
  - systemctl status be-service
  - tail -f /var/log/be-service.log


file /etc/systemd/system/be-service.service:

```
[Unit]
Description=Spring Boot Backend Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/SEP490_Gr66_SkillGapGuide/sgg
ExecStart=/opt/SEP490_Gr66_SkillGapGuide/sgg/mvnw spring-boot:run
Restart=always
RestartSec=10

# Logging
StandardOutput=append:/var/log/be-service.log
StandardError=append:/var/log/be-service-error.log

# Environment
Environment=JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

[Install]
WantedBy=multi-user.target
```