FROM node:20-alpine

RUN apk add --no-cache python3 make g++ libstdc++ sqlite-dev

WORKDIR /app

ARG BOT_TOKEN
ENV BOT_TOKEN=$BOT_TOKEN

RUN echo -n "BOT_TOKEN = $BOT_TOKEN" > .env

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --omit=dev

CMD ["node", "dist/bot.js"]
