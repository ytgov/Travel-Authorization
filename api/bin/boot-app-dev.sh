#!/bin/sh

# Run migrations
npm run knex migrate:latest

initialization_status=$?
if [ $initialization_status -ne 0 ]; then
  echo "Failed to complete initialization, exit code was $initialization_status"
  exit 1
fi

# Start the application
npm run start
