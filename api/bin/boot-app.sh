#!/bin/sh

# Run initializers
node ./dist/initializers/index.js

initialization_status=$?
if [ $initialization_status -ne 0 ]; then
  echo "Failed to complete initialization, exit code was $initialization_status"
  exit 1
fi

# Start the application
node ./dist/index.js
