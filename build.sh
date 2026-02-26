#!/bin/bash
# Build the image for linux/amd64 and load it into local docker daemon
# We use --build-arg NODE_ENV=production to ensure a production build
docker buildx build --platform linux/amd64 --load --build-arg NODE_ENV=production -t cyrusn/strapi:latest ./app

# Save the image to a tar file
docker save -o app.tar cyrusn/strapi:latest
