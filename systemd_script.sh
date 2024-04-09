#!/bin/bash

APP_NAME="backend-app-tutor"
WORKDIR="/home/root/${APP_NAME}"
APP_PORT=3000

cd "$WORKDIR"
pwd

echo "Node version is $(node -v)"

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
