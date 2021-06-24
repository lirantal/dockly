FROM node:12-alpine

LABEL maintainer="Liran Tal <liran.tal@gmail.com>"
LABEL contributor="Eitan Schichmanter <eitan.sch@gmail.com>"

RUN apk update && apk upgrade && apk add docker && rm -rf /var/apk/cache/*

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

COPY . /app
WORKDIR /app
ENV NODE_ENV production
RUN yarn install --frozen-lockfile

CMD ["node", "index.js"]
