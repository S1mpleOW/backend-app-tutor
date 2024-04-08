#! /bin/bash
WORKDIR="/var/lib/jenkins/workspace/backend-app-tutor"
APP_NAME="backendapptutor"
APP_PORT=3000
PROCESS_NAME="${APP_NAME}.service"
NODE_VERSION=$1
if [[ "$NODE_VERSION" == "16" || "$NODE_VERSION" == "18" ]]; then
  echo "Node version is acceptable."
else
  echo "Node version is not acceptable. Please use version 16 or 18."
  exit 1
fi

nvm use $NODE_VERSION
echo "Node version is $NODE_VERSION"

if ! [ -d "$WORKDIR" ]; then
  echo "Directory not found"
  exit 1
fi

cd $WORKDIR

if [-f package-lock.json ]; then
  npm ci
else
  npm install
fi

npm run up:dev
npm run start:dev
