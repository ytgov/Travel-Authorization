#!/bin/sh

if [ "$NODE_ENV" != "production" ]; then
  # Run initializers in development
  npm run ts-node ./src/initializers/index.ts
else
  # Run initializers in production
  node ./dist/initializers/index.js
fi

# Check initialization status
initialization_status=$?
if [ $initialization_status -ne 0 ]; then
  echo "Failed to complete initialization, exit code was $initialization_status"
  exit 1
fi

# Start the application
if [ "$NODE_ENV" != "production" ]; then
  npm run start
else
  node ./dist/index.js
fi
