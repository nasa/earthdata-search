#!/bin/bash

# Read the shard number from the command line argument
SHARD_NUMBER=$1

# Run the Playwright tests with the specified shard number
# Wait for an extra time after the server is up to ensure that the application is fully loaded before running the tests
npx start-server-and-test preview http-get://localhost:8080 'npm run playwright -- --shard='"$SHARD_NUMBER"''
