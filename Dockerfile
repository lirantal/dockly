FROM node:8-alpine

LABEL maintainer="Liran Tal <liran.tal@gmail.com>"
LABEL contributor="Eitan Schichmanter <eitan.sch@gmail.com>"

RUN apk add docker && rm -rf /var/apk/cache/*

COPY . /app
WORKDIR /app
ENV NODE_ENV production
RUN yarn install

CMD ["node", "index.js"]
