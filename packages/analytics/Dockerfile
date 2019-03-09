FROM mhart/alpine-node:8.15

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . /app

EXPOSE 3000

ENV NODE_ENV production

CMD [ "yarn", "start" ]
