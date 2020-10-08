FROM node:14-buster AS builder 
ADD ./ui /srv
RUN cd /srv && rm -rf ./node_modules && npm run build:production

FROM nginx:latest
COPY --from=builder /srv/dist/* /usr/share/nginx/html/
COPY ./configuration/generic-configuration.json /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/mime.types /etc/nginx/mime.types