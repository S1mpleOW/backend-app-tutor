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

install_nvm() {
  if ! [[ -f '~/.profile' ]]; then
    touch ~/.profile && source ~/.profile
  fi
  nvm current || echo "SSH NVM is being installed" && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh -o install_nvm.sh && bash install_nvm.sh && source ~/.profile
  echo "checking nvm"
  bash ~/.nvm/nvm.sh;
  nvm --version || exit 1;
  nvm install
  nvm use
}

install_nvm

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
