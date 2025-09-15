# syntax=docker/dockerfile:1
FROM node:22 as build
WORKDIR /app
COPY . .
ENTRYPOINT [ "/bin/bash" ]
