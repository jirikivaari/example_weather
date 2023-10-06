#!/bin/bash

cd /app/frontend ||  { echo "Cannot find application"; exit 1; }

# Developer mode
if [[ -n "$DEBUG" ]]; then
    npm run dev 2>&1 |tee -a /logs/backend.log
    exit 0
else
    # Loop to recover from random crashes
    while true; do
        npm run start 2>&1 |tee -a /logs/frontend.log
        echo "$(date +%F %H:%M): Backend CRASH! Rebooting."
        sleep 5
    done
fi