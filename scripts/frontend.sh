#!/bin/bash

# Move node_modules to the frontend folder if they are not there
[[ -d "/app/frontend/node_modules" ]]  || mv /opt/node_modules /app/frontend/node_modules

cd /app/frontend ||  { echo "Cannot find application"; exit 1; }

# Install dependencies in case something is missing
npm install

# Developer mode
if [[ -n "$DEBUG" ]]; then
    npm run dev 2>&1 |tee -a /logs/frontend.log
    exit 0
else
    # Loop to recover from random crashes
    while true; do
        npm run start 2>&1 |tee -a /logs/frontend.log
        echo "$(date "+%F %H:%M"): Frontend CRASH! Rebooting."
        sleep 5
    done
fi