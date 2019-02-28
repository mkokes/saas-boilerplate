FROM node:8.15.0-alpine

WORKDIR /app

COPY packages/analytics/package*.json ./

RUN yarn install

COPY packages/analytics /app

EXPOSE 3000

ENV NODE_ENV production

CMD [ "yarn", "start" ]
