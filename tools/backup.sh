#!/bin/bash

# Configuration
REMOTE_SRC="root@calp:~/strapi-app"
LOCAL_DEST="."

echo "Preparing to backup data from remote machine ($REMOTE_SRC)..."

# Sync database data
echo "Syncing database folder (./data)..."
rsync -avz --delete root@calp:~/strapi-app/data/ ./data/

# Sync uploads (optional but usually needed with data)
echo "Syncing uploads folder (./uploads)..."
rsync -avz --delete root@calp:~/strapi-app/uploads/ ./uploads/

echo "Backup complete. Remote data has been synced to your local folder."
