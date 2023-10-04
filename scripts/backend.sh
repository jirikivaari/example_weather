#!/bin/bash

[[ -n "$APPID" ]] || { echo "Please set ENV variable APPID to API key."; exit 2; }

cd /app/backend ||  { echo "Cannot find application"; exit 1; }

# Loop to recover from random crashes
while true; do
    npm run start 2>&1 |tee -a /logs/backend.log
    echo "$(date +%F %H:%M): Backend CRASH! Rebooting."
    sleep 5
done