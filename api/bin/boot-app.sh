#!/bin/sh

if [ "$NODE_ENV" != "production" ]; then
  # Run initializers in development
  npm run ts-node -- --files src/initializers/index.ts
else
  # Run initializers in production
  node ./dist/src/initializers/index.js
fi

# Start the application
if [ "$NODE_ENV" != "production" ]; then
  npm run start
else
  node ./dist/src/server.js
fi
