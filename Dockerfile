FROM node:14.2.0-alpine3.11 as build
WORKDIR /app

COPY ./package.json .
RUN npm install
COPY . .
RUN ng build

FROM nginx as runtime
COPY --from=build /app/dist/fuse /usr/share/nginx/html