FROM node:14.21-alpine3.16 as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install
COPY . .
RUN ng build

FROM nginx as runtime
COPY --from=build /app/dist/fuse /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# docker build -t bi-app .
# docker run --rm -p 80:80 --name bi-app bi-app