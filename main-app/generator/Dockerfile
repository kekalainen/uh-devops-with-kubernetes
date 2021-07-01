FROM node:14-alpine

WORKDIR /usr/src/app
COPY . .
RUN npm ci

USER 1000
ENTRYPOINT node ./index.js
