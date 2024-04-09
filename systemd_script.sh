#!/bin/bash

APP_NAME="backend-app-tutor"
WORKDIR="/home/${USER}/${APP_NAME}"
APP_PORT=3000
NODE_VERSION=16
PROCESS_NAME="${APP_NAME}.service"

if [ -f ".nvmrc" ]; then
  NODE_VERSION=$(cat .nvmrc | grep -oP 'v\d+' | cut -c 2-)
fi

echo "${NODE_VERSION}"
echo "${PROCESS_NAME}"

source /home/${USER}/.nvm/nvm.sh

nvm install
nvm use

echo "Node version is $(node -v)"

# Export working directory as a environment variable
export WORKDIR

cd "$WORKDIR" || exit 1

if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

if ! [[ -f .env ]]; then
  cp env-example-document .env
fi

npm run up:dev
npm run start:dev
