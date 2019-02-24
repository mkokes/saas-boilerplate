FROM node:8.15.0-alpine

WORKDIR /src

COPY package*.json ./

RUN yarn install --frozen-lockfile --no-cache --production

COPY . /src

EXPOSE 3000

ENV NODE_ENV production

CMD [ "yarn", "start" ]
