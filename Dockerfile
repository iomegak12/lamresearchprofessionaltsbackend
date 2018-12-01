FROM mhart/alpine-node:latest

COPY build /app

WORKDIR /app

RUN npm install --production

EXPOSE 6767

ENTRYPOINT node index.js
