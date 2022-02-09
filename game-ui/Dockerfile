FROM node:14 as build-stage

WORKDIR /game-ui
COPY package.json .
RUN npm install
COPY . .

ARG GAME_APP_API_BASE_URL
ENV GAME_APP_API_BASE_URL=$GAME_APP_API_BASE_URL

RUN npm run build

# Stage 2
FROM nginx:1.17.0-alpine

COPY --from=build-stage /game-ui/dist /usr/share/nginx/html
EXPOSE $GAME_DOCKER_PORT

CMD nginx -g 'daemon off;'
