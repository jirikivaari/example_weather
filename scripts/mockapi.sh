#!/bin/bash

cd /app/mockapi ||  { echo "Cannot find application"; exit 1; }

# Loop to recover from random crashes
while true; do
    npm run start 2>&1 |tee -a /logs/mockapi.log
    echo "$(date "+%F %H:%M"): Mockapi CRASH! Rebooting."
    sleep 5
done