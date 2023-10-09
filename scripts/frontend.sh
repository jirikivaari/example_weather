#!/bin/bash

# Move node_modules to the frontend folder if they are not there
if ! [[ -d "/app/frontend/node_modules" ]]; then
    echo "Copying node_modules, this will take a moment."
    mv /opt/node_modules /app/frontend/node_modules
fi

cd /app/frontend ||  { echo "Cannot find application"; exit 1; }

mkdir -p /app/logs

# Install dependencies in case something is missing
echo "Installing NPM dependencies..."
npm install

# Developer mode
if [[ "$NODE_ENV" == "production" ]]; then 
    npm run build
else
    npm run start 2>&1 |tee -a /app/logs/frontend.$(date +%F_%H-%M.log)
    exit 0
fi