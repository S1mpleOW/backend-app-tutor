#! /bin/bash
APP_NAME="backendapptutor"
APP_PORT=3000
PROCESS_NAME="${APP_NAME}.service"
sudo cp "${APP_NAME}.service" /lib/systemd/system/
sudo chmod +x "/lib/systemd/system/${APP_NAME}.service"

sudo systemctl daemon-reload

sudo fuser -k "${APP_PORT}/tcp" || true

sudo systemctl start "${PROCESS_NAME}"

echo "Sleep 10 seconds" | sleep 10

sudo systemctl status "${PROCESS_NAME}"
