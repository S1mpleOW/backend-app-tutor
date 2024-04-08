#!/bin/bash

WORKDIR="/var/lib/jenkins/workspace/Backend-nodejs-pipeline"
APP_NAME="backendapptutor"
APP_PORT=3000
PROCESS_NAME="${APP_NAME}.service"

source ~/.nvm/nvm.sh

if ! [[ -f ".nvmrc" ]]; then
  nvm use 16
else
  nvm use
fi

echo "Node version is $(node -v)"

if ! [[ -d "$WORKDIR" ]]; then
  echo "Directory not found"
  exit 1
fi

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
