#!/bin/bash

# Move node_modules to the frontend folder if they are not there
[[ -d "/app/mockapi/node_modules" ]]  || mv /opt/node_modules /app/mockapi/node_modules

cd /app/mockapi ||  { echo "Cannot find application"; exit 1; }

mkdir -p /app/logs

# Install dependencies in case something is missing
npm install

# Loop to recover from random crashes
while true; do
    npm run start 2>&1 |tee -a /app/logs/mockapi.$(date +%F_%H-%M.log)
    echo "$(date "+%F %H:%M"): Mockapi CRASH! Rebooting."
    sleep 5
done