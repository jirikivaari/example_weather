#!/bin/bash

# Move node_modules to the backend folder if they are not there
[[ -d "/app/backend/node_modules" ]]  || mv /opt/node_modules /app/backend/node_modules

[[ -n "$APPID" ]] || { echo "Please set ENV variable APPID to API key."; exit 2; }
cd /app/backend ||  { echo "Cannot find application"; exit 1; }

# Install dependencies in case something is missing
npm install

# Loop to recover from random crashes
if [[ -n "$DEBUG" ]]; then
    npm run dev 2>&1 |tee -a /logs/backend.log
    exit 0
else
    while true; do
        npm run start 2>&1 |tee -a /logs/backend.log
        echo "$(date "+%F %H:%M"): Backend CRASH! Rebooting."
        sleep 5
    done
fi
