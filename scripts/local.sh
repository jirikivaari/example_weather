#!/bin/bash

APP_ROOT=$(dirname "$0")/..

cd "$APP_ROOT/frontend" ||  { echo "Cannot find application"; exit 1; }
cd "$APP_ROOT/backend" ||  { echo "Cannot find application"; exit 1; }
[[ -n "$APPID" ]] || { echo "Please set ENV variable APPID to API key."; exit 2; }

# Start backend server.
cd "$APP_ROOT/backend"
npm install ||  { echo "Cannot install NPM packages."; exit 1; }
npm run start &

sleep 5

# Start frontend server.
cd "$APP_ROOT/frontend"
npm install ||  { echo "Cannot install NPM packages."; exit 1; }
npm run start