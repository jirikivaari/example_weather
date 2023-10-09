#!/bin/bash

APP_ROOT=$(dirname "$0")/..
APP_ROOT_ABS=$(realpath "$APP_ROOT")

test -d "$APP_ROOT/frontend" ||  { echo "Cannot find frontend"; exit 1; }
test -d "$APP_ROOT/backend" ||  { echo "Cannot find backend"; exit 1; }
[[ -n "$APPID" ]] || { echo "Please set ENV variable APPID to API key."; exit 2; }

# Start backend server.
cd "$APP_ROOT_ABS/backend"
npm install ||  { echo "Cannot install NPM packages."; exit 1; }
npm run dev &

sleep 5

# Start frontend server.
cd "$APP_ROOT_ABS/frontend"
npm install ||  { echo "Cannot install NPM packages."; exit 1; }
npm run start