FROM node:14-alpine

WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN chown -R 1000:1000 $(pwd)

USER 1000
EXPOSE 8080
ENTRYPOINT node ./index.js
