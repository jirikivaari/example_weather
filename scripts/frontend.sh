#!/bin/bash

# Move node_modules to the frontend folder if they are not there
[[ -d "/app/frontend/node_modules" ]]  || mv /opt/node_modules /app/frontend/node_modules

cd /app/frontend ||  { echo "Cannot find application"; exit 1; }

mkdir -p /app/logs

# Install dependencies in case something is missing
npm install

# Developer mode
if [[ "$NODE_ENV" == "production" ]]; then 
    npm run build
else
    npm run start 2>&1 |tee -a /app/logs/frontend.$(date +%F_%H-%M.log)
    exit 0
fi