#!/bin/bash

APP_NAME="backend-app-tutor"
APP_PORT=3000

show_state() {
  echo "Node version: $(node -v)"
  echo "NPM version: $(npm -v)"
  echo "App name: ${APP_NAME}"
  echo "App port: ${APP_PORT}"
  echo "Working directory: ${pwd}"
}

show_state

if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

if ! [[ -f .env ]]; then
  cp env-example-document .env
fi

npm run up:dev

pm2 start npm --name "backendapptutor" -- run "start:dev"

sleep 10

pm2 status
pm2 ls -m

pm2 logs > log-pm2.out
