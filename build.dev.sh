#!/bin/bash
docker buildx build  -t cyrusn/strapi:latest ./app

# Restart services
echo "Restarting services..."
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up -d

# Cleanup old images to save space
echo "Pruning old images..."
docker image prune -f

echo "Application updated and running!"
