FROM node:8.15.0-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . /app

EXPOSE 3000

ENV NODE_ENV production

CMD [ "yarn", "start" ]
