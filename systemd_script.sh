#!/bin/bash

WORKDIR=$(dirname "$(realpath "$0")")
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
