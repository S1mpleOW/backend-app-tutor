#!/bin/bash

APP_NAME="backend-app-tutor"
WORKDIR="/home/root/${APP_NAME}"
APP_PORT=3000
NODE_VERSION=16
PROCESS_NAME="${APP_NAME}.service"

if [ -f ".nvmrc" ]; then
  NODE_VERSION=$(cat .nvmrc | grep -oP 'v\d+' | cut -c 2-)
fi

echo "${NODE_VERSION}"
echo "${PROCESS_NAME}"

check_nvm() {
  [[ -s "$HOME/.nvm/nvm.sh" ]] && \. "$HOME/.nvm/nvm.sh"
  if ! command -v nvm &>/dev/null; then
    echo "NVM is not installed. Please install NVM first."
    exit 1
  fi
  if ! [[ -f '.nvmrc']]; then
    echo "No .nvmrc file found. Please create one."
    exit 1
  fi
  cat .nvmrc
  nvm --version || exit 1;
  nvm install
  nvm use
}

check_nvm

echo "Node version is $(node -v)"

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
