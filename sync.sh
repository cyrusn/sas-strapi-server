#!/bin/bash

# Configuration
REMOTE_DEST="root@calp:~/strapi-app"

echo "Checking for required files..."

# Ensure the app.tar exists
if [ ! -f "app.tar" ]; then
    echo "Error: app.tar not found! Run ./build.sh first."
    exit 1
fi

# Ensure .env exists
if [ ! -f ".env" ]; then
    echo "Error: .env not found!"
    exit 1
fi

echo "Creating remote directory if it doesn't exist..."
ssh root@calp "mkdir -p ~/strapi-app"

echo "Syncing files to $REMOTE_DEST..."

# Copy app.tar, docker-compose.prod.yml, run.sh, and app/.env (renamed to .env)
scp app.tar docker-compose.yml run.sh root@calp:~/strapi-app/
scp .env root@calp:~/strapi-app/.env

echo "Successfully synced files to $REMOTE_DEST"
echo "Next steps on remote machine:"
echo "1. ssh root@calp"
echo "2. cd ~/strapi-app"
echo "3. docker load -i app.tar"
echo "4. docker compose -f docker-compose.yml up -d"
