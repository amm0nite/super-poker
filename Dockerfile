FROM node:lts as node

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build.prod

FROM nginx

COPY --from=node /app/dist/* /usr/share/nginx/html/
