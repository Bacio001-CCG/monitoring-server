#!/bin/sh
set -e

echo "Running database migrations..."
node dist/src/database/migrate.js

echo "Starting server in production mode..."
exec node dist/src/main.js
