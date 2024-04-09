#!/bin/bash
APP_NAME="backendapptutor"
APP_PORT=3000
NODE_VERSION=16
PROCESS_NAME="${APP_NAME}.node${NODE_VERSION}.service"
if [ -f ".nvmrc" ]; then
  NODE_VERSION=$(cat .nvmrc | grep -oP 'v\d+' | cut -c 2-)
  PROCESS_NAME="${APP_NAME}.node${NODE_VERSION}.service"
fi

echo "${NODE_VERSION}"
echo "${PROCESS_NAME}"

sudo cp "${APP_NAME}.service" /lib/systemd/system/
sudo chmod +x "/lib/systemd/system/${APP_NAME}.service"

sudo systemctl daemon-reload

sudo fuser -k "${APP_PORT}/tcp" || true

sudo systemctl start "${PROCESS_NAME}"

echo "Sleep 10 seconds" | sleep 10

sudo systemctl status "${PROCESS_NAME}"
