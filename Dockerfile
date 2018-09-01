FROM mhart/alpine-node:8

LABEL maintainer="Liran Tal <liran.tal@gmail.com>"
LABEL contributor="Eitan Schichmanter <eitan.sch@gmail.com>"

COPY . /app
WORKDIR /app
ENV NODE_ENV production
RUN yarn install

CMD ["node", "index.js"]