FROM node:14

WORKDIR /game-api
COPY package.json .
RUN npm install
COPY . .
CMD npm start
