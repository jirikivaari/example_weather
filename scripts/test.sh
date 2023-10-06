#!/bin/bash

cd /app/frontend ||  { echo "Cannot find application"; exit 1; }
cd /app/backend ||  { echo "Cannot find application"; exit 1; }

[[ -d "/app/frontend/node_modules" ]]  || mv /opt/node_modules_fe /app/frontend/node_modules
[[ -d "/app/backend/node_modules" ]]  || mv /opt/node_modules_be /app/backend/node_modules

# Run backend unit tests
# FIXME: Also fix for mocha / NPM bug.
echo "Running backend unit tests."
cd /app/backend
npm install
chmod 0755 node_modules/.bin/mocha
npm run test

# Start backend server. Needed for robot integration tests.
cd /app/backend
npm run start > /logs/backend.log &

# Start frontend server. Frontend test' node needs to access the server for DOM
cd /app/frontend
npm install
chmod 0755 node_modules/.bin/mocha
npm run start > /logs/frontend.log &

# Wait for frontend to start. This will hang if it doesn't.
echo "Waiting for frontend to start..."
while ! tail -n +1 -f /logs/frontend.log | grep -qE "webpack.*compiled successfully"; do sleep 1; done

# Run frontend unit tests
echo "Running frontend unit tests."
cd /app/frontend
npm run test

# Run robot tests
echo "Running robot tests."
cd /app/frontend/src/test
# export MOZ_LOG_FILE="/path/to/logfile.log"
# export MOZ_LOG_FILE="/gecko.log
source /python3/bin/activate
robot -d /logs --loglevel DEBUG integration-tests.robot

echo "Testing finished! Cake is a lie."

# Do not quit if requested
[[ -n "$STAY_ALIVE" ]] && /bin/bash