#!/bin/bash

cd ui
npm run build:production
cd -

docker-compose -f docker-compose-production.yml up -d

echo "Sleeping for 30 seconds so elastic has time to start"
sleep 30
cd ocfl-indexer
node indexer.js \
    --source ../ocfl-repository \
    --search http://localhost/search \
    --username indexer \
    --password somerandompassword
