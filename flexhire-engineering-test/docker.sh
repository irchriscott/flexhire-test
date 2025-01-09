#!/usr/bin/env bash

NAME=flexhire-engineering-test

if docker image inspect "$NAME" &> /dev/null; then
    echo "Image $NAME already exists. Skipping build."
else
    echo "Building image $NAME..."
    docker build -t "$NAME" .
    
    # Check if the build was successful
    if [ $? -eq 0 ]; then
        echo "Image $NAME built successfully."
    else
        echo "Error: Failed to build image $NAME"
        exit 1
    fi
fi

docker run -it --name $NAME --user flexhire -p 3000:3000 -p 8080:8080 -v .:/workspace flexhire-engineering-test bash