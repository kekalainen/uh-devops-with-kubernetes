#!/bin/bash

export IMAGE=kekalainen/uh-devops-with-kubernetes
export TAG="$1"
export DIRECTORY="$2"

docker build -t "$IMAGE:$TAG" "$DIRECTORY"
docker push "$IMAGE:$TAG"
